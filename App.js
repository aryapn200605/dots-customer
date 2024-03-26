/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import RootNavigation from "./src/navigations/RootNavigation";
import AuthProvider from "./src/providers/AuthenticationProvider";
import { NavigationContainer } from "@react-navigation/native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-paper-toast";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { StatusBar } from 'react-native';

const App = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
  });

  // StatusBar.setHidden(true);
  StatusBar.setBackgroundColor('#00AA8D');

  return (
    <AuthProvider>
        <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ToastProvider>
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </ToastProvider>
        </PaperProvider>
    </SafeAreaProvider>
      </AuthProvider>
  );
};

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#273B9A",
    accent: "#273B9A",
  },
};

export default App;
