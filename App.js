import 'react-native-gesture-handler';
import * as React from 'react';

import AppNav from './eve/navigation/AppNav';
import { AuthProvider } from './eve/context/AuthContext';


export default function App() {
  return (
    <AuthProvider>
      <AppNav/>
    </AuthProvider>
  );
}