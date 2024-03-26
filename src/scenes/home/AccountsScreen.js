import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Appbar, Chip, Divider, Headline, List } from "react-native-paper";
import { SceneMap } from "react-native-tab-view";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { TabView } from "react-native-tab-view";
import { useToast } from "react-native-paper-toast";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { findAllSaving } from "../../api/SavingApi";
import { findAllLoan } from "../../api/LoanApi";
import { findAllDeposit } from "../../api/DepositApi";
import { APP_TYPE } from "@env";
import Color from "../../common/Color";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const AccountsScreen = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [index, setIndex] = useState(0);
  const [dataSaving, setDataSaving] = useState([]);
  const [dataLoan, setDataLoan] = useState([]);
  const [dataDeposit, setDataDeposit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toaster = useToast();
  const layout = useWindowDimensions();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const saving = await findAllSaving(token);
      const loan = await findAllLoan(token);
      const deposit = await findAllDeposit(token);
      setLoading(false);
      setDataSaving(saving.data.data);
      setDataLoan(loan.data.data);
      setDataDeposit(deposit.data.data);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    handleCheckToken();
    fetchData();
  }, []);

  const [routes] = useState([
    { key: "savings", title: APP_TYPE == 1 ? "Simpanan" : "Tabungan" },
    { key: "loan", title: APP_TYPE == 1 ? "Pinjaman" : "Kredit" },
    { key: "deposit", title: APP_TYPE == 1 ? "Sim. Berjangka" : "Deposito" },
  ]);

  if (error) {
    navigation.goBack();
    toaster.show({
      message: "Terjadi error saat memuat data tabungan: " + error.message,
    });
  }

  const renderItem = (data, route) => {
    return (
      <View style={styles.box}>
        <List.Item
          onPress={() => navigation.navigate(route, { id: data.id })}
          titleStyle={{ marginBottom: 8 }}
          title={<Text>{data.productType.name}</Text>}
          description={<Text>{data.id}</Text>}
          left={(props) => (
            <List.Icon
              color={Colors.white}
              style={{
                backgroundColor: Color.primaryBackgroundColor.backgroundColor,
                borderRadius: 10,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "3%",
              }}
              icon="wallet"
            />
          )}
        />
      </View>
    );
  };

  const renderSavingAccountsList = () => {
    return (
      <>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateSavingAccount")}
            style={{
              backgroundColor: Color.primaryBackgroundColor.backgroundColor,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              Ajukan {APP_TYPE == 1 ? "Simpanan" : "Tabungan"} Baru
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={dataSaving}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => renderItem(item, "SavingDetail")}
          />
        </View>
      </>
    );
  };

  const renderLoanAccountsList = () => {
    return (
      <>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateLoanAccount")}
            style={{
              backgroundColor: Color.primaryBackgroundColor.backgroundColor,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              Ajukan {APP_TYPE == 1 ? "Pinjaman" : "Kredit"} Baru
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={dataLoan}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => renderItem(item, "LoanDetail")}
          />
        </View>
      </>
    );
  };

  const renderDepositAccountsList = () => {
    return (
      <>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateDepositAccount")}
            style={{
              backgroundColor: Color.primaryBackgroundColor.backgroundColor,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              Ajukan {APP_TYPE == 1 ? "Simpanan Berjangka" : "Deposito"} Baru
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            data={dataDeposit}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => renderItem(item, "DepositDetail")}
          />
        </View>
      </>
    );
  };

  const renderTabBar = (props) => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setIndex(i)}
              key={route.key}
            >
              {index === i && (
                <Chip
                  style={{ marginRight: 10 }}
                  textStyle={{ fontWeight: "bold", fontSize: 16 }}
                >
                  <Text>{route.title}</Text>
                </Chip>
              )}
              {index !== i && (
                <Text style={{ marginTop: 6, marginRight: 10, fontSize: 16 }}>
                  {route.title}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderScene = SceneMap({
    savings: renderSavingAccountsList,
    loan: renderLoanAccountsList,
    deposit: renderDepositAccountsList,
  });

  return (
    <View style={styles.screen}>
      <Appbar.Header style={Color.primaryBackgroundColor}>
        <Appbar.Content
          style={styles.heading}
          title="Rekening Saya"
          titleStyle={{ color: "#EAEBF8", fontSize: 25 }}
        />
      </Appbar.Header>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          initialLayout={{ width: layout.width }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    height: "100%",
  },
  heading: {
    marginLeft: "5%",
    color: "white",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "8%",
    paddingRight: "8%",
    paddingTop: "3%",
    paddingBottom: "3%",
  },
  box: {
    padding: 10,
  },
  createButtonContainer: {
    width: "100%",
    backgroundColor: "White",
    padding: 10,
  },
});

export default AccountsScreen;
