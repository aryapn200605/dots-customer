import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Appbar, TextInput, Button, Caption } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { useContext } from "react";
import { createLoan, findLoanProdukType } from "../../api/LoanApi";
import { APP_TYPE } from "@env"
import DropDown from "react-native-paper-dropdown";

const CreateLoanAccount = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);
  
  const [service, setService] = useState("");
  const [showDropDownService, setshowDropDownService] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [produkNumber, setProdukNumber] = useState("");
  const [mutationLoading, setMutationLoading] = useState(false);
  const [showDropDow, setShowDropDown] = useState(false);
  const [jangkaDropdown, setJangkaDropdown] = useState("");

  const fetchData = async () => {
    try {
      findLoanProdukType(token).then((result) => {
        setDropdown(result.data.data);
        console.log(result.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setProdukNumber(cleanedText);
  };

  const formatToRupiah = (angka) => {
    return `Rp. ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const handleSumit = async () => {
    if (!service) {
      Alert.alert("Kesalahan", "Kolom Produk diperlukan.");
    } else if (!produkNumber) {
      Alert.alert("Kesalahan", "Kolom Jumlah Pengajuan diperlukan.");
    } else if (!jangkaDropdown) {
      Alert.alert("Kesalahan", "Kolom jangka Dropdown diperlukan.");
    } else if (produkNumber > 1000000000000) {
      Alert.alert(
        "Kesalahan",
        "Jumlah Pengajuan tidak boleh melebihi 1.000.000.000.000."
      );
    } else {
      setMutationLoading(true);
      try {
        createLoan(token, {
          productType: service,
          currentBalance: produkNumber,
          period: jangkaDropdown,
        }).then((result) => {
          navigation.goBack();
          Alert.alert(
            "Sukses",
            "Berhasil Mengajukan " + (APP_TYPE == 1 ? "Pinjaman" : "Kredit") + " Baru. Silahkan cek notifikasi secara berkala"
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const jangka = [
    { label: 1 + " bulan", value: 1 },
    { label: 3 + " bulan", value: 3 },
    { label: 6 + " bulan", value: 6 },
    { label: 9 + " bulan", value: 9 },
    { label: 12 + " bulan", value: 12 },
    { label: 18 + " bulan", value: 18 },
    { label: 24 + " bulan", value: 24 },
    { label: 36 + " bulan", value: 36 },
  ];

  useEffect(() => {
    handleCheckToken();
    fetchData();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={APP_TYPE == 1 ? "Ajukan Pinjaman Baru" : "Ajukan Kredit Baru"} />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.box}>
          <Caption>Produk</Caption>
          <DropDown
            dropDownStyle={{ marginTop: 20 }}
            mode={"outlined"}
            visible={showDropDownService}
            showDropDown={() => setshowDropDownService(true)}
            onDismiss={() => setshowDropDownService(false)}
            value={service}
            setValue={setService}
            list={dropdown}
            style={[styles.dropdown, { backgroundColor: "white" }]}
          />

          <Caption>Jumlah Pengajuan</Caption>
          <TextInput
            style={styles.input}
            mode="outlined"
            value={formatToRupiah(produkNumber)}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />

          <Caption>Jangka Waktu</Caption>
          <DropDown
            dropDownStyle={{ marginTop: 20 }}
            mode={"outlined"}
            visible={showDropDow}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={jangkaDropdown}
            setValue={setJangkaDropdown}
            list={jangka}
          />

          <Button
            mode="contained"
            style={{ marginTop: 20, ...Color.primaryBackgroundColor }}
            onPress={handleSumit}
            disabled={mutationLoading}
            loading={mutationLoading}
          >
            {mutationLoading ? "Mengirim..." : "Kirim"}
          </Button>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    marginTop: 20,
    borderRadius: 15,
  },
  input: {
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 10,
  },
});

export default CreateLoanAccount;
