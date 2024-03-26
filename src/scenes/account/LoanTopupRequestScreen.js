import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Appbar } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { createLoanTopup, findReasonList, reasonList } from "../../api/LoanApi";
import { AuthContext } from "../../providers/AuthenticationProvider";
import Color from "../../common/Color";
import DropDown from "react-native-paper-dropdown";

const LoanTopupRequest = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);
  const [isFocused, setIsFocused] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [showDropDownService, setshowDropDownService] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(null);
  const [reasonList, setReasonList] = useState([]);

  const route = useRoute();
  const { id } = route.params;

  handleCheckToken();

  const handleTextInputFocus = () => {
    setIsFocused(true);
  };

  const handleTextInputBlur = () => {
    setIsFocused(false);
  };

  const handleInputChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setAmount(cleanedText);
  };

  const formatToRupiah = (angka) => {
    return `Rp. ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert("Kesalahan", "Kolom Jumlah diperlukan.");
    } else if (!reason) {
      Alert.alert("Kesalahan", "Kolom Alasan diperlukan.");
    } else if (parseInt(amount.replace(/[^0-9]/g, "")) > 1000000000000) {
      Alert.alert(
        "Kesalahan",
        "Jumlah Pengajuan tidak boleh melebihi 1.000.000.000.000."
      );
    } else {
      setMutationLoading(true);

      Alert.alert(
        "Konfirmasi",
        "Pastikan data yang anda masukan sudah benar",
        [
          {
            text: "Batal",
            onPress: () => {
              setMutationLoading(false);
            },
            style: "cancel",
          },
          {
            text: "Ya",
            onPress: async () => {
              try {
                await createLoanTopup(token, {
                  loanId: id,
                  amount: parseInt(amount.replace(/[^0-9]/g, "")),
                  reason: reason,
                });

                navigation.goBack();
                Alert.alert(
                  "Sukses",
                  "Berhasil Mengajukan TopUp. Silahkan cek notifikasi secara berkala"
                );
              } catch (error) {
                console.error("API Error:", error);
                Alert.alert("Error", "Gagal mengirim top-up");
              } finally {
                setMutationLoading(false);
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const fetchData = async () => {
    try {
      const data = await findReasonList();
      setReasonList(data.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pengajuan Topup" />
      </Appbar.Header>

      <View style={styles.box}>
        <Text>Nomor Rekening</Text>
        <TextInput
          style={styles.input}
          underlineColor=""
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
          placeholder={id}
          disabled
        />

        <Text style={styles.text}>Jumlah</Text>
        <TextInput
          style={styles.input}
          underlineColor=""
          placeholder={isFocused ? "Rp." : ""}
          placeholderTextColor="#999999"
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
          keyboardType="numeric"
          value={formatToRupiah(amount)}
          onChangeText={handleInputChange}
        />

        <Text style={styles.text}>Alasan</Text>
        <DropDown
          mode={"outlined"}
          visible={showDropDownService}
          showDropDown={() => setshowDropDownService(true)}
          onDismiss={() => setshowDropDownService(false)}
          dropDownStyle={{ marginTop: 20 }}
          value={reason}
          setValue={setReason}
          list={reasonList}
          style={styles.dropdown}
        />

        <TouchableOpacity onPress={handleSubmit}>
          <Button
            style={styles.btn}
            disabled={mutationLoading}
            loading={mutationLoading}
          >
            <Text style={styles.btnSubmit}>
              {mutationLoading ? "Mengirim..." : "Kirim"}
            </Text>
          </Button>
        </TouchableOpacity>
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
  text: {
    marginTop: 10,
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
  dropdown: {
    marginBottom: 10,
    marginTop: 10,
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  btn: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    marginTop: 20,
  },
  btnSubmit: {
    color: "#ffffff",
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
  confirmModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmModal: {
    backgroundColor: "white",
    width: 300,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  cancelButton: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  confirmButton: {
    color: "#041562",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoanTopupRequest;
