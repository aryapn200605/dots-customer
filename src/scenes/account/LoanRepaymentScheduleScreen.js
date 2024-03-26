import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Appbar } from "react-native-paper";
import { Table, Row, Rows, Col } from "react-native-table-component";
import { findLoanBillById } from "../../api/LoanApi";
import { AuthContext } from "../../providers/AuthenticationProvider";

const LoanRepaymentScheduleScreen = ({ navigation, route }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);

  const { id } = route.params;

  const itemsPerPage = 10;

  const fetchDataBill = async () => {
    try {
      const result = await findLoanBillById(token, id);
      setData(result.data.data);
      const totalPages = Math.ceil(result.data.data.length / itemsPerPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error API:", error);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    handleCheckToken();
    fetchDataBill();
  }, []);

  return (
    <View>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Lihat Jadwal Tagihan" />
      </Appbar.Header>

      <View style={styles.box}>
        <View style={styles.container}>
          <Table borderStyle={{ borderWidth: 0}}>
            <Row
            data={["Ke", "Tgl", "Pokok", "Bunga", "Denda", "Total"]}
            textStyle={ styles.head }
            />
            <Rows
              data={getCurrentPageData()}
              textStyle={styles.textData}
            />
          </Table>
        </View>
        {data.length > itemsPerPage && (
          <View style={styles.pagination}>
            {currentPage > 1 && (
              <TouchableOpacity onPress={() => goToPage(currentPage - 1)}>
                <Text
                  style={
                    currentPage === 1 ? styles.disabledButton : styles.button
                  }
                >
                  ← Previous
                </Text>
              </TouchableOpacity>
            )}
            <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
            {currentPage < totalPages && (
              <TouchableOpacity onPress={() => goToPage(currentPage + 1)}>
                <Text
                  style={
                    currentPage === totalPages
                      ? styles.disabledButton
                      : styles.button
                  }
                >
                  Next →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Title: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: 25,
    marginTop: Platform.select({
      android: 30,
    }),
  },
  arrow: {
    marginLeft: Platform.select({
      ios: 10,
      android: 10,
    }),
    marginTop: Platform.select({
      android: 30,
    }),
    marginRight: Platform.select({
      ios: 15,
      android: 15,
    }),
  },
  head: {
    paddingBottom: 5,
    borderBottomWidth: 1,
    textAlign: "center",
  },
  textHead: {
    margin: 6,
    fontSize: 14,
  },
  textData: {
    textAlign: "center",
    fontSize: 10,
    width: "100%",
    marginVertical: 8
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    margin: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#080808",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    fontSize: 18,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  button: {
    marginRight: 10,
    backgroundColor: "white",
  },
});

export default LoanRepaymentScheduleScreen;
