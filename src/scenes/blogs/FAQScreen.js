import React, { useState } from "react";
import { Appbar, ActivityIndicator } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { API_URL } from "@env"

const FAQScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const handleLoadEnd = () => {
    setLoading(false);
  };

  return (
    <>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="FAQ" />
      </Appbar.Header>
      <View style={styles.container}>
        {loading && (
          <ActivityIndicator
            style={styles.activityIndicator}
            animating={loading}
            color="#007AFF"
            size="large"
          />
        )}
        <WebView
          source={{ uri: API_URL + "/mobile/FAQ" }}
          style={styles.webView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onLoadEnd={handleLoadEnd}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FAQScreen;
