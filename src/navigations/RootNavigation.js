import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthenticationProvider";
import { findTenantByid } from "../api/tenant";
import { PUBLIC_ID } from "@env";
import AppNavigation from "./AppNavigation";
import AuthenticationNavigation from "./AuthenticationNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const RootNavigation = () => {
  const [loadingUser, setLoadingUser] = useState(true);
  const { user, setUser, setTenant } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const result = await findTenantByid(PUBLIC_ID);
      const data = result.data.data;
      await AsyncStorage.setItem("tenantName", data.name);

      let auth = await SecureStore.getItemAsync("authInfo");
      if (auth !== null) {
        const u = JSON.parse(auth);
        setUser(u.user, u.accessToken);
      }

      let tenantData = await SecureStore.getItemAsync("currentTenant");
      if (tenantData !== null) {
        const t = JSON.parse(tenantData);
        setTenant(t);
      }
    } catch (error) {
      console.error("Error fetching tenant data:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!loadingUser) {
    const isLoggedIn = !!user;
    return isLoggedIn ? <AppNavigation /> : <AuthenticationNavigation />;
  }
};

export default RootNavigation;
