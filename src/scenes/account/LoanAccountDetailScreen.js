import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, FlatList } from "react-native";
import {
  Appbar,
  Caption,
  Divider,
  Headline,
  IconButton,
  List,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { findLoanById, findLoanNowlById } from "../../api/LoanApi";
import { Card, Paragraph, Title } from "react-native-paper";
import { useFonts } from "expo-font";
import { APP_TYPE } from "@env";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import MenuButton from "../../components/common/MenuButton";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const LoanAccountDetailScreen = ({ navigation, route }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [isBalanceShown, setIsBalanceShown] = useState(false);
  const [loanLoading, setLoanLoading] = useState(true);
  const [data, setData] = useState({});
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [bill, setBill] = useState([]);

  const { id } = route.params;

  const parameter = {
    route: "LoanPayment",
    norek: id,
    type: 2,
  };

  let [fontLoaded] = useFonts({
    "SomeTypeMono-Bold": require("../../../assets/fonts/SometypeMono-Bold.ttf"),
  });

  const menus = [
    {
      id: 1,
      title: "Top-up",
      icon: "journal-outline",
      onPress: () => navigation.navigate("LoanTopupRequest", { id: data.id }),
    },
    {
      id: 2,
      title: "Bayar Tagihan",
      icon: "cash-outline",
      onPress: () =>
        navigation.navigate("PaymentMethodSelection", { parameter }),
    },
    {
      id: 3,
      title: "Jadwal Tagihan",
      icon: "list-outline",
      onPress: () =>
        navigation.navigate("LoanRepaymentScheduleScreen", { id: data.id }),
    },
  ];

  const fetchData = async () => {
    try {
      const result = await findLoanById(token, id);
      setData(result.data.data);
      setSkeletonLoading(false);
      setLoanLoading(false);
    } catch (error) {
      console.error("Error API:", error);
      setSkeletonLoading(false);
      setLoanLoading(false);
    }
  };

  const fetchDataBill = async () => {
    try {
      const result = await findLoanNowlById(token, id);
      setBill(result.data.data);
      setSkeletonLoading(false);
      setLoanLoading(false);
    } catch (error) {
      console.error("Error API:", error);
      setSkeletonLoading(false);
      setLoanLoading(false);
    }
  };

  const renderSkeletonLoader = () => {
    return (
      <>
        <ShimmerPlaceholder
          style={{
            width: "40%",
            height: 25,
            marginBottom: 15,
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "80%",
            height: 20,
            marginBottom: 15,
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "20%",
            height: 15,
            marginBottom: 15,
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 17,
            marginBottom: 18,
          }}
          autoRun={true}
        />
      </>
    );
  };

  const renderAccountInfo = () => {
    return (
      <View>
        <Text style={styles.bankName}>
          {data.productType && data.productType.name
            ? data.productType.name
            : "Product Name Not Available"}
        </Text>
        <Text
          style={{
            fontFamily: "SomeTypeMono-Bold",
            color: "white",
            fontSize: 25,
          }}
        >
          {data.id ? data.id : "Account Number Not Available"}{" "}
        </Text>
        <Text style={styles.balanceTitle}>
          Sisa {APP_TYPE == 1 ? "Pinjaman" : "Kredit"}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.balance}>
            Rp{" "}
            {isBalanceShown
              ? data.outstandingBalance
                ? ` ${parseFloat(data.outstandingBalance).toLocaleString(
                    "en-US"
                  )}`
                : "Balance Not Available"
              : "**********"}
          </Text>
          <IconButton
            onPress={() => setIsBalanceShown(!isBalanceShown)}
            icon={isBalanceShown ? "eye-off" : "eye"}
            iconColor="white"
            size={25}
          />
        </View>
      </View>
    );
  };

  function formatAmount(amount) {
    const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formattedAmount;
  }

  const renderTransactionItem = (item) => {
    return (
      <Card style={styles.transactionCard}>
        <Card.Content>
          <Text style={{ fontSize: 15 }}>{item.description}</Text>
          <View style={styles.transactionDetails}>
            <View style={styles.timestampContainer}>
              <Text>{item.repaymentDate}</Text>
            </View>
            <View style={styles.captionContainer}>
              <Caption style={styles.transactionAmountCaption}>
                Rp.{formatAmount(item.amount)}
              </Caption>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  useEffect(() => {
    handleCheckToken();
    fetchData();
    fetchDataBill();
  }, []);

  return (
    <ScrollView style={styles.screen}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={APP_TYPE == 1 ? "Pinjaman" : "Kredit"} />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.headingBlock}>
          <LinearGradient
            style={styles.headingGradient}
            colors={Color.primaryGradientColor}
          >
            {skeletonLoading ? renderSkeletonLoader() : renderAccountInfo()}
          </LinearGradient>
          <FlatList
            horizontal={true}
            data={menus}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.menuButton}>
                <MenuButton
                  style={styles.menuButton}
                  iconName={item.icon}
                  title={item.title}
                  onPress={item.onPress}
                />
              </View>
            )}
          />
        </View>
        <View>
          <Headline style={styles.detailHeading}>Sejarah Pembayaran - (10)</Headline>
          {loanLoading ? (
            <View style={{ marginTop: 15 }}>
              <LoadingOverlay />
            </View>
          ) : (
            <FlatList
              data={bill}
              renderItem={({ item }) => renderTransactionItem(item)}
              ItemSeparatorComponent={() => <Divider />}
            />
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flexGrow: 1,
    flex: 1
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
  detailHeading: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginVertical: 10
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
    paddingBottom: 5,
  },
  balanceTitle: {
    marginTop: "7%",
    color: "white",
  },
  balance: {
    marginBottom: "6%",
    marginTop: 5,
    fontSize: 21,
    fontWeight: "bold",
    color: "white",
  },
  bankName: {
    marginBottom: 20,
    fontSize: 20,
    color: "white",
  },
  menuButton: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 7,
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  billItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  billInfo: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "400",
  },
  paragraph: {
    marginTop: 5,
    fontSize: 17,
  },
  transactionAmountCaption: {
    right: 0,
    fontSize: 20,
    top: 0,
    fontWeight: "bold",
    marginRight: 10,
  },
  debitTrxAmount: {
    color: "red",
  },
  creditTrxAmount: {
    color: "#95D362",
  },
  
  transactionCard: {
    marginBottom: 0,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timestampContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  captionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  card: {
    margin: 20,
    marginTop: 10,
    marginBottom: "30%",
  },
  menuButtonTextContainer: {
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDescription: {
    fontSize: 14,
    color: "black",
  },
  transactionDate: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default LoanAccountDetailScreen;
