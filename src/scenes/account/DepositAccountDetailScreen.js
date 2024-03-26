import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  Appbar,
  Headline,
  List,
  Caption,
  IconButton,
  Divider,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { useToast } from "react-native-paper-toast";
import MenuButton from "../../components/common/MenuButton";
import Color from "../../common/Color";
import { findDepositById } from "../../api/DepositApi";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { useFonts } from "expo-font";
import { APP_TYPE } from "@env";

const DepositAccountDetailScreen = ({ navigation, route }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [isBalanceShown, setIsBalanceShown] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [accountNumber, setAccountNumber] = useState("");
  const [jangkaWaktu, setJangkaWaktu] = useState("");
  const [availableBalance, setAvailableBalance] = useState("");

  const { id } = route.params;

  let [fontLoaded] = useFonts({
    "SomeTypeMono-Bold": require("../../../assets/fonts/SometypeMono-Bold.ttf"),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await findDepositById(token, id);
      const data = result.data.data;
      setName(data.productType.name);
      setAccountNumber(data.id);
      setAvailableBalance(data.currentBalance);
      setJangkaWaktu(data.jangkawaktu);
      setLoading(false);
    } catch (error) {
      console.error("Error API:", error);
      setLoading(false);
    }
  };

  const renderAccountInfoPlaceholder = () => {
    return (
      <View>
        <ShimmerPlaceholder
          style={{
            width: "70%",
            height: 25,
            marginBottom: "7%",
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "80%",
            height: 20,
            marginBottom: "10%",
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "30%",
            height: 15,
            marginBottom: "5%",
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "46%",
            height: 20,
            marginBottom: "7.5%",
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "60%",
            height: 20,
            marginBottom: "7.5%",
          }}
          autoRun={true}
        />
      </View>
    );
  };

  const renderAccountInfo = () => {
    return (
      <View>
        <Text adjustFontSizeToFit style={styles.bankName}>
          {name}
        </Text>
        <Text
          style={{
            fontFamily: "SomeTypeMono-Bold",
            color: "white",
            fontSize: 25,
          }}
        >
          {accountNumber}
        </Text>
        <Text style={styles.balanceTitle}>Saldo Aktif</Text>
        <View style={{ flexDirection: "row" }}>
          <Headline adjustFontSizeToFit style={styles.balance}>
            Rp{" "}
            {isBalanceShown
              ? parseFloat(availableBalance).toLocaleString("en")
              : "**********"}
          </Headline>
          <IconButton
            onPress={() => setIsBalanceShown(!isBalanceShown)}
            icon={isBalanceShown ? "eye-off" : "eye"}
            iconColor="white"
            size={25}
            style={{ bottom: 5 }}
          />
        </View>
        <Text style={styles.timePeriod}>
          Jangka Waktu : {jangkaWaktu} Bulan
        </Text>
      </View>
    );
  };

  useEffect(() => {
    handleCheckToken();
    fetchData();
  }, []);

  return (
    <View style={styles.screen}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={APP_TYPE == 1 ? "Sim.Berjangka" : "Deposito"} />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.headingBlock}>
          <LinearGradient
            style={styles.headingGradient}
            colors={Color.primaryGradientColor}
          >
            {loading ? renderAccountInfoPlaceholder() : renderAccountInfo()}
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flexGrow: 1,
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
  headingBlock: {
    marginTop: "3%",
    width: "95%",
    borderRadius: 10,
    alignSelf: "center",
  },
  headingGradient: {
    borderRadius: 10,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
  },
  timePeriod: {
    fontSize: 15,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
  },
  balanceTitle: {
    marginTop: "7%",
    color: "white",
  },
  balance: {
    marginBottom: "6%",
    fontSize: 21,
    fontWeight: "bold",
    color: "white",
  },
  accountNumber: {
    fontSize: 18,
    color: "white",
    fontFamily: "Credit-Regular",
  },
  bankName: {
    marginBottom: 20,
    fontSize: 20,
    color: "white",
  },
  contentBlock: {
    paddingTop: "5%",
    flex: 1,
    height: "100%",
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "#EAEBF8",
  },
  buttonRow: {
    flex: 1,
    flexDirection: "column",
    margin: 5,
  },
});

export default DepositAccountDetailScreen;
