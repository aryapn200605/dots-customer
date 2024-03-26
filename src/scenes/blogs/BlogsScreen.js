import React, { useContext } from "react";
import { Appbar } from "react-native-paper";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../../providers/AuthenticationProvider";
import HTML from "react-native-render-html";
import Lightbox from "react-native-lightbox-v2";

function BlogScreen({ route, navigation, navigator }) {
  const { handleCheckToken } = useContext(AuthContext);
  
  const { item } = route.params;

  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1.0);

  handleCheckToken();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 20, marginLeft: "20%" }}>{item.title}</Text>
      </Appbar.Header>
        <Lightbox navigator={navigator}>
          <Image
            style={{ width: ITEM_WIDTH, height: ITEM_WIDTH * 0.5 }}
            source={{ uri: item.imageUrl }}
          />
        </Lightbox>
      <View style={styles.content}>
        <HTML source={{ html: item.description }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
});

export default BlogScreen;
