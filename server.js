require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Create a Mongoose schema for the 'users' collection
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pH_baseline: [{ type: Number }],
  temp_baseline: [{ type: Number }],
  imp_baseline: [{ type: Number }],
  pH_history: [{ type: Number }],
  temp_history: [{ type: Number }],
  imp_history: [{ type: Number }],
  date_history: [{ type: String }],
  time_history: [{ type: String }],
});

// Create a Mongoose model for the 'users' collection
const User = mongoose.model('User', userSchema);

// Route for creating a new user
app.post('/api/register', async (req, res) => {
  // Extract username and password from request body
  const { name, username, password } = req.body;

  try {
      // Validate username and password
      if (!username || !password) {
          return res.status(400).json({ error: 'username and password are required' });
      }

      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ error: 'username already exists' });
      }

      // Create a new user instance
      const newUser = new User({ name, username, password });

      // Save the new user to the database
      await newUser.save();

      // Return success response
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for user authentication (login)
app.post('/api/login', async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  try {
      // Validate username and password
      if (!username || !password) {
          return res.status(400).json({ error: 'username and password are required' });
      }

      // Find the user in the database
      const user = await User.findOne({ username, password });
      if (!user) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate a token
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

      // Return the token as JSON response
      res.json({ name: user.name, username, password, token });
  } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to authenticate users using JWT tokens
const authenticateUser = (req, res, next) => {
  // Extract token from request headers
  const token = req.headers.authorization;
  // Verify token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
          // Token verification failed
          return res.status(401).json({ error: 'Unauthorized' });
      } else {
          // Token verification successful
          req.user = decoded; // Attach user information to request object
          next(); // Call next middleware
      }
  });
};

// Apply authentication middleware to routes that require authentication
app.use('/api/history', authenticateUser);
app.use('/api/calibrate', authenticateUser);

// Route for calibrating user's baseline data
app.post('/api/calibrate', async (req, res) => {
  const { pHBaseline, tempBaseline, impBaseline } = req.body
  const { username } = req.user;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's baseline data
    user.pH_baseline = pHBaseline;
    user.temp_baseline = tempBaseline;
    user.imp_baseline = impBaseline;

    await user.save();

    res.status(200).json({ message: 'Baseline data calibrated successfully' });
  } catch (error) {
    console.error('Error calibrating baseline data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for retrieving user data
app.get('/api/calibrate', async (req, res) => {
  try {
    // Extract username from JWT token
    const { username } = req.user;

    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data including baseline values
    res.status(200).json({
      pH_baseline: user.pH_baseline,
      temp_baseline: user.temp_baseline,
      imp_baseline: user.imp_baseline,
      // You can include other user data here if needed
    });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for storing historical data
app.post('/api/history', async (req, res) => {
  // Extract historical data from request body
  const { pH_history, temp_history, imp_history } = req.body;
  // Extract username from JWT token
  const { username } = req.user; // Assuming you have middleware to extract user from token

  try {
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has any historical data within the last hour
    const lastRecord = user.date_history[user.date_history.length - 1];
    if (lastRecord) {
      const lastRecordDate = new Date(lastRecord);
      const currentDate = new Date();
      // Calculate the time difference in milliseconds
      const timeDiff = currentDate - lastRecordDate;
      // Convert time difference to hours
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      if (hoursDiff < (1/60)) {
        // If data has been collected within the last hour, return an error response
        return res.status(400).json({ error: 'Data cannot be collected within an hour of the last record' });
      }
    }

    // Update the user's historical data
    if (pH_history && Array.isArray(pH_history)) {
        user.pH_history.push(...pH_history);
    }
    if (temp_history && Array.isArray(temp_history)) {
        user.temp_history.push(...temp_history);
    }
    if (imp_history && Array.isArray(imp_history)) {
        user.imp_history.push(...imp_history);
    }

    // Update date and time arrays
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get month (zero-based index)
    const day = String(currentDate.getDate()).padStart(2, '0'); // Get day
    const year = currentDate.getFullYear(); // Get year

    const formattedDate = `${month}-${day}-${year}`; // Format: MM-DD-YYYY
    // Adjust the locale options to get the time in HH:MM format
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }); // Format: HH:MM

    // Push formatted date to date_history
    user.date_history.push(formattedDate);
    user.time_history.push(formattedTime);

    // Save the updated user document
    await user.save();

    // Return success response
    res.status(200).json({ message: 'Historical data saved successfully' });
  } catch (error) {
    console.error('Error storing historical data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for retrieving historical data
app.get('/api/history', async (req, res) => {
  // Extract username from JWT token
  const { username } = req.user; // Assuming you have middleware to extract user from token

  try {
      // Find the user in the database
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Return the user's historical data
      const historicalData = {
          date_history: user.date_history,
          time_history: user.time_history,
          pH_history: user.pH_history,
          temp_history: user.temp_history,
          imp_history: user.imp_history
      };

      res.status(200).json(historicalData);
  } catch (error) {
      console.error('Error retrieving historical data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to test the connection to MongoDB
app.get('/api/test', async (req, res) => {
  try {
      // Check if the connection is successful
      await mongoose.connection.db.admin().ping();

      // Connection is successful
      res.send('Connection to MongoDB successful!');
  } catch (error) {
      // Connection failed
      console.error('Error connecting to MongoDB:', error);
      res.status(500).send('Error connecting to MongoDB');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});