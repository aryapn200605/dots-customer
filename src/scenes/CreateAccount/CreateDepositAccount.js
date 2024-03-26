import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, TextInput, Button, Caption } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { useContext } from "react";
import { createDeposit, findDepositProdukType } from "../../api/DepositApi";
import { Alert } from "react-native";
import DropDown from "react-native-paper-dropdown";
import { APP_TYPE } from "@env"

const CreateDepositAccount = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [Service, setService] = useState("");
  const [showDropDownService, setshowDropDownService] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [produkNumber, setProdukNumber] = useState("");
  const [mutationLoading, setMutationLoading] = useState(false);

  const fetchData = async () => {
    try {
      findDepositProdukType(token).then((result) => {
        setDropdown(result.data.data);
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
    if (!Service) {
      Alert.alert("Kesalahan", "Kolom Produk diperlukan.");
    } else if (!produkNumber) {
      Alert.alert("Kesalahan", "Kolom Jumlah Pengajuan diperlukan.");
    } else if (produkNumber > 1000000000000) {
      Alert.alert(
        "Kesalahan",
        "Jumlah Pengajuan tidak boleh melebihi 1.000.000.000.000."
      );
    } else {
      setMutationLoading(true);
      try {
        createDeposit(token, {
          productType: Service,
          currentBalance: produkNumber,
        }).then((result) => {
          navigation.goBack();
          Alert.alert(
            "Sukses",
            "Berhasil Mengajukan " + (APP_TYPE == 1 ? "Sim. Berjangka Baru" : "Deposito Baru") + ". Silahkan cek notifikasi secara berkala"
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    handleCheckToken();
    fetchData();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={APP_TYPE == 1 ? "Ajukan Sim.Berjangka Baru" : "Ajukan Deposito Baru"} />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.box}>
          <Caption>Produk</Caption>
          <DropDown
            mode={"outlined"}
            visible={showDropDownService}
            showDropDown={() => setshowDropDownService(true)}
            onDismiss={() => setshowDropDownService(false)}
            dropDownStyle={{ marginTop: 20 }}
            value={Service}
            setValue={setService}
            list={dropdown}
            style={styles.dropdown}
          />

          <Caption>Jumlah Pengajuan</Caption>
          <TextInput
            style={styles.input}
            mode="outlined"
            value={formatToRupiah(produkNumber)}
            onChangeText={handleInputChange}
            keyboardType="numeric"
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

export default CreateDepositAccount;
