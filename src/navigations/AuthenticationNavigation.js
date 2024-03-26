import React, { useContext } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../scenes/authentication/LoginScreen';

const AuthenticationNavigation = () => {

  const AuthenticationNavigator = createStackNavigator();

  return (
    <AuthenticationNavigator.Navigator
      initialRouteName={'Login'}
    >
      <AuthenticationNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </AuthenticationNavigator.Navigator>
  );
};

export default AuthenticationNavigation;
