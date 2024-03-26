import React, { useState, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Image } from "react-native";
import { Appbar, Button, Caption, TextInput } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { ScrollView } from "react-native-gesture-handler";
import { createSavingDeposit } from "../../api/SavingApi";
import { APP_TYPE } from "@env";

const SavingDepositRequestScreen = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [isFocused, setIsFocused] = useState(false);
  const [rekeningPengirim, setRekeningPengirim] = useState("");
  const [amount, setAmount] = useState("Rp. ");
  const [disableButton, setDisableButton] = useState(false);
  const [image, setImage] = useState(null);

  handleCheckToken();

  const route = useRoute();
  const { selectedMethod = "Pilih Metode Pembayaran", parameter } =
    route.params || {};

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled) {
      return;
    }

    if (pickerResult.assets.length > 0) {
      setImage({ uri: pickerResult.assets[0].uri });
    } else {
      // Menangani situasi ketika tidak ada gambar yang dipilih
      alert("No image selected!");
      console.log("gagal");
    }
  };

  const handleTextInputFocus = () => {
    setIsFocused(true);
  };

  const handleTextInputBlur = () => {
    setIsFocused(false);
  };

  const handleInputChange = (text) => {
    const cleanedText = text.replace(/[^\d]/g, "");
    if (cleanedText) {
      const numericValue = Number.parseInt(cleanedText, 10);
      if (!isNaN(numericValue)) {
        const formattedValue = "Rp. " + numericValue.toLocaleString();
        setAmount(formattedValue);
      }
    } else {
      setAmount("Rp. ");
    }
  };

  const handleRekeningPengirimChange = (text) => {
    setRekeningPengirim(text);
  };

  function generateTransactionNumber() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); // Hari
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Bulan
    const year = currentDate.getFullYear(); // Tahun
    const hour = String(currentDate.getHours()).padStart(2, '0'); // Jam
    const minute = String(currentDate.getMinutes()).padStart(2, '0'); // Menit
    const second = String(currentDate.getSeconds()).padStart(2, '0'); // Detik
  
    return `${day}${month}${year}${hour}${minute}${second}`;
  }

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert("Error", "Kolom Jumlah Belum Di isi.");
      } else if (!image) {
        Alert.alert("Error", "Belum Mengungah bukti transfer");
    } else if (parseInt(amount.replace(/[^0-9]/g, "")) > 1000000000000) {
      Alert.alert(
        "Kesalahan",
        "Jumlah Pengajuan tidak boleh melebihi 1.000.000.000.000."
      );
    } else {
      Alert.alert("Konfirmasi", "Pastikan data yang anda masukan sudah benar", [
        {
          text: "Batal",
          onPress: () => "Transaksi dibatalkan",
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: async () => {
            try {
              setDisableButton(true);

              const base64Image = await FileSystem.readAsStringAsync(image.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });

              createSavingDeposit(token, {
                image: {uri: image.uri, name: "image.jpg", type: "image/jpeg", base64: base64Image},
                savingId: parameter.norek,
                paymentMethodId: selectedMethod.id,
                amount: parseInt(amount.replace(/[^0-9]/g, "")),
                // recipient: rekeningPengirim,
                recipient: ".",
              }).then((result) => {
                navigation.navigate("SavingDetail", { id: parameter.norek });
                Alert.alert(
                  "Sukses",
                  "Berhasil Mengajukan Setoran. Silahkan cek notifikasi secara berkala"
                );
                console.log("=============================",result);
              });
            } catch (error) {
              console.error("API Error:", error);
            }
          },
        },
      ]);
    }
  };

  return (
    <>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={APP_TYPE == 1 ? "Setoran Simpanan" : "Setroan Tabungan"}
        />
      </Appbar.Header>

      <ScrollView>
        <View style={styles.box}>
          <Caption style={styles.text}>Metode Pembayaran</Caption>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputDisable}
              placeholder="Pilih Metode Pembayaran"
              editable={false}
              value={selectedMethod.title}
              readonly
            />
          </View>
          <Caption style={styles.text}>Nomor Rekening</Caption>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputDisable}
              placeholder="Pilih Metode Pembayaran"
              editable={false}
              value={
                selectedMethod.description
                  ? selectedMethod.description
                  : "No. Rekening Tidak Ada"
              }
              readonly
            />
          </View>
          {/* <Caption style={styles.text}>Nama Rekening Pengirim</Caption>
          <TextInput
            style={styles.input}
            underlineColor="transparent"
            placeholderTextColor="#999999"
            onChangeText={handleRekeningPengirimChange}
            // value={rekeningPengirim}
            value="."
          /> */}
          <Caption style={styles.text}>Jumlah</Caption>
          <TextInput
            style={styles.input}
            underlineColor=""
            placeholder={isFocused ? "" : "Rp."}
            placeholderTextColor="#999999"
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            value={amount}
            keyboardType="numeric"
            onChangeText={handleInputChange}
          />
          <Caption style={styles.text}>Bukti Transfer</Caption>
          <Button
            onPress={handleImagePicker}
            style={styles.btnImage}
            textColor="#FFFFFF"
            buttonColor="#CCCCCC"
          >
            Pilih Gambar
          </Button>
          {image && <Image source={{ uri: image.uri }} style={styles.image} />}
          <Text>No. Transaksi : {generateTransactionNumber()}</Text>
          <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
            <Text disabled={disableButton} style={styles.buttonText}>
              SAYA SUDAH TRANSFER
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flex: 1,
    padding: 25,
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 18,
    marginTop: "2%",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#080808",
    borderRadius: 5,
    fontSize: 18,
  },
  inputDisable: {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderWidth: 1,
    borderColor: "#080808",
    borderRadius: 5,
    fontSize: 18,
  },
  btn: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    marginTop: 20,
  },
  image: {
    maxWidth: "100%",
    height: 400,
    marginVertical: 20,
  },
  btnImage: {
    // marginTop: 20,
    // marginHorizontal: 20,
  },
  btnSubmit: {
    color: "#ffffff",
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  textInput: {
    height: 40,
    marginBottom: 10,
    borderColor: "#F5F8FB",
    backgroundColor: "transparent",
  },
  showPasswordIcon: {
    marginTop: 15,
  },
  text: {
    marginTop: 15,
  },
  tabunganContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    marginTop: 30,
    borderRadius: 5,
  },
  tabunganText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  norekText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  txt: {
    marginBottom: 10,
  },
  customButton: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SavingDepositRequestScreen;
