import React, { useContext } from "react";
import { View, StyleSheet, Alert, Linking } from "react-native";
import { Headline, List, Divider, Appbar } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env"

const SettingScreen = () => {
  const { logout, handleCheckToken } = useContext(AuthContext);
  
  const navigation = useNavigation();

  handleCheckToken()

  const handleChangePasswordPress = () => {
    navigation.navigate("ChangePassword");
  };

  const handleFAQPress = () => {
    navigation.navigate("FAQScreen");
  };

  return (
    <View style={styles.screen}>
    <Appbar.Header style={Color.primaryBackgroundColor}>
      <Appbar.Content
        style={styles.heading}
        title="Settings"
        titleStyle={{ color: "#EAEBF8", fontSize: 25 }}
      />
    </Appbar.Header>

      <List.Item
        style={styles.settingMenuButton}
        title="FAQ"
        onPress={handleFAQPress}
      />
      <Divider />
      <List.Item
        style={styles.settingMenuButton}
        title="Ubah Password"
        onPress={handleChangePasswordPress}
      />
      <Divider />
      <List.Item
        style={styles.settingMenuButton}
        titleStyle={{ color: "#E74C3C", fontWeight: "bold" }}
        title="Keluar"
        onPress={() => {
          Alert.alert(
            "Perhatian",
            "Apakah anda yakin ingin keluar?",
            [{ text: "Keluar", onPress: logout }],
            { cancelable: true }
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flex: 1,
  },
  heading: {
    fontSize: 30,
    marginLeft: "5%",
    paddingBottom: "2%",
    color: "white",
  },
  settingMenuButton: {
    backgroundColor: "white",
  },
});

export default SettingScreen;
