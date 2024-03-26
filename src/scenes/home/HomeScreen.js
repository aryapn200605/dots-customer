import React, { useContext, useEffect, useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Headline, Appbar, Subheading } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { FlatGrid } from "react-native-super-grid";
import { findAllImage } from "../../api/carosel";
import { API_URL, APP_NAME } from "@env";
import Color from "../../common/Color";
import SplashScreen from "../../components/common/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuButton from "../../components/common/MenuButton";

const HomeScreen = ({ navigation }) => {
  const { user, token, handleCheckToken } = useContext(AuthContext);

  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tenantName, setTenantName] = useState("");
  // const [currentSlide, setCurrentSlide] = useState({ activeSlide: 0 });

  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1.0);

  const menus = [
    {
      id: 4,
      title: "Reservasi",
      icon: "calendar",
      onPress: () => navigation.navigate("AttendanceReservation"),
    },
  ];

  const fetchdata = () => {
    try {
      findAllImage(token)
        .then((result) => {
          const data = result.data.data;

          if (Array.isArray(data)) {
            const modifiedData = data.map((item) => ({
              ...item,
              imageUrl: API_URL + "/" + item.imageUrl,
            }));

            setImage(modifiedData);
          } else {
            console.warn("Data is not an array:", data);
            setImage([]);
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error in fetchData:", error);
      setIsLoading(false);
    }
  };

  const getTenantFromStorage = async () => {
    try {
      const storedTenantName = await AsyncStorage.getItem("tenantName");
      if (storedTenantName) {
        setTenantName(storedTenantName);
      }
    } catch (error) {
      console.error("Error getting tenant name from AsyncStorage:", error);
    }
  };

  const onCarouselItemPress = (item) => {
    navigation.navigate("Blog", {
      item: item,
    });
  };

  const renderCarouselItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => onCarouselItemPress(item)}>
        <View style={{ alignSelf: "center" }}>
          <Image
            style={{ width: ITEM_WIDTH, height: ITEM_WIDTH * 0.5 }}
            source={{ uri: item.imageUrl }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    handleCheckToken();
    fetchdata();
    getTenantFromStorage();
  }, []);

  return (
    <View style={styles.screen}>
      <Appbar.Header style={Color.primaryBackgroundColor}>
        <Appbar.Content
          style={styles.appbarContent}
          title={APP_NAME}
          titleStyle={{ color: "#EAEBF8" }}
        />
      </Appbar.Header>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          <View style={Color.primaryBackgroundColor}>
            <Headline adjustFontSizeToFit style={styles.heading}>
              Selamat Datang
            </Headline>
            <Subheading adjustFontSizeToFit style={styles.subheading}>
              {user && user.firstName} {user && user.lastName}
            </Subheading>
          </View>
          <View>
            <Carousel
              layout="default"
              data={image}
              renderItem={renderCarouselItem}
              sliderWidth={ITEM_WIDTH}
              useScrollView={true}
              onSnapToItem={(index) => setCurrentSlide({ activeSlide: index })}
              itemWidth={ITEM_WIDTH}
              loop={true}
              autoplayDelay={5}
              autoplayInterval={5}
            />
            <Pagination
              dotsLength={image.length}
              // activeDotIndex={currentSlide}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "black",
              }}
              inactiveDotStyle={{}}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
          <View>
            <FlatGrid
              data={menus}
              keyExtractor={(item, index) => index}
              itemDimension={80}
              renderItem={({ item }) => (
                <View style={styles.buttonRow}>
                  <MenuButton
                    style={styles.menuButton}
                    iconName={item.icon}
                    title={item.title}
                    numColumns={2}
                    onPress={item.onPress}
                  />
                </View>
              )}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flex: 1,
  },
  heading: {
    marginLeft: "5%",
    fontSize: 25,
    color: "#ffffff",
    fontWeight: "bold",
  },
  subheading: {
    marginLeft: "5%",
    marginTop: "1%",
    color: "#EFF0F5",
    marginBottom: "5%",
    fontSize: 18,
  },
  menuTitle: {
    marginLeft: "5%",
    marginTop: "8%",
    marginBottom: "4%",
    fontSize: 27,
  },
  date: {
    marginLeft: "5%",
    marginTop: "1.5%",
    fontSize: 18,
  },
  headingBlock: {
    backgroundColor: "#0E47A0",
  },
  menuButton: {
    marginRight: 5,
    marginLeft: 10,
    marginTop: 7,
    marginBottom: 0,
  },
  buttonRow: {
    flex: 1,
    flexDirection: "column",
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#0E47A0",
  },
  appbarContent: {
    alignItems: "center",
  },
});

export default HomeScreen;
