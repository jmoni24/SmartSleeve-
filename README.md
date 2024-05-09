The code has two main sections: a frontend and a backend with the large bulk of the code existing in the frontend.
The frontend code can be broken down as such:
App.js: the main code page where everything runs through
Screens Folder: contains the  screens which the user sees while navigating the application
~ Includes LoginScreen.js, RegisterScreen.js, CalibrationScreen.js, HomeScreen.js, HistoryScreen.js, FAQScreen.js, and AboutUsScreen.js
Navigation Folder: contains the necessary code that allows for the user to navigate from screen to screen
~ Includes AppNav.js, AppStack.js, and AuthStack.js
Context Folder: contains the authorization code that allows for the phone application to communicate with the backend server for user authentication
~ Includes AuthContext.js and config.js
Components Folder: contains the code that allows for the drawer functionality in the phone application
~ Includes CustomDrawer.js
Images Folder: contains the necessary images and backgrounds for the application aesthetic and appeal
~ Includes logo_ss.png, bname_ss.png, menubkg.png, pbe_ss.png, a_ss.png, g_ss.png, j_ss.png, p_ss.png

The backend code contains one page and simply allows the phone application to communicate with the API authentication call and the backend database for user authentication and data storage/retrieval
~ Includes server.js

