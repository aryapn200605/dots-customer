import React, { createContext, useReducer, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { ApiManager } from "../api/ApiManager";
import { PUBLIC_ID } from "@env";
import { checkToken } from "../api/CheckToken";
import { Alert } from "react-native";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        exp: action.payload.exp,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
    token: "",
    exp: null,
  });

  const setUser = (user, token, exp) => {
    dispatch({
      type: "SET_USER",
      payload: { user, token, exp },
    });
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authInfo");
      setUser(null, "", null);
    } catch (error) {
      console.error("Error deleting authInfo:", error);
    }
  };

  const login = async (username, password) => {
    try {
      const data = await ApiManager.post("/login", {
        username: username,
        password: password,
        clientType: "CUSTOMER",
        tenantID: PUBLIC_ID,
      });

      await SecureStore.setItemAsync("authInfo", JSON.stringify(data.data));
      setUser(data.data.user, data.data.accessToken, data.data.exp);

      return data;
    } catch (error) {
      switch (error.response?.status) {
        case 401:
          throw "Username atau password salah";
        default:
          throw `Terjadi kesalahan saat login (code: ${error})`;
      }
    }
  };

  const handleCheckToken = async () => {
    try {
      const response = await checkToken(state.token);
      const msg = response.data.message;

      if (!state.token || msg != "active") {
        Alert.alert(
          "Sesi telah berakhir",
          "Silakan login kembali",
          [
            {
              text: "OK",
              onPress: logout,
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        exp: state.exp,
        setUser,
        logout,
        login,
        handleCheckToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
