import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Appbar, TextInput, Button, Caption } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { ChangePassword } from "../../api/UserApi";
import { useContext } from "react";

const ChangePasswordScreen = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mutationLoading, setMutationLoading] = useState(false);

  handleCheckToken();

  const handleSubmit = async () => {
    if (currentPassword === "") {
      Alert.alert("Kesalahan", "Kata sandi lama diperlukan");
    } else if (newPassword === "") {
      Alert.alert("Kesalahan", "Kata sandi baru diperlukan");
    } else if (confirmPassword === "") {
      Alert.alert("Kesalahan", "Konfirmasi kata sandi diperlukan");
    } else if (newPassword !== confirmPassword) {
      Alert.alert("Kesalahan", "Kata sandi baru dan konfirmasi tidak cocok");
    } else if (!isPasswordValid(newPassword)) {
      Alert.alert(
        "Kesalahan",
        "Kata sandi baru harus memiliki setidaknya satu karakter, satu huruf besar, dan satu angka"
      );
    } else {
      setMutationLoading(true);

      try {
        const result = await ChangePassword(token, {
          old_password: currentPassword,
          new_password: newPassword,
        });

        if (result.data.message === "Wrong password") {
          Alert.alert("Kesalahan", "Kata sandi Lama salah");
        } else {
          navigation.goBack();
          Alert.alert("Berhasil", "Kata sandi berhasil diubah", [
            {
              text: "OK",
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/~`]).+$/;
    return passwordRegex.test(password);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ganti Kata sandi" />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.box}>
          <Caption>Kata sandi lama</Caption>
          <TextInput
            style={[styles.input, { backgroundColor: "white" }]}
            mode="outlined"
            secureTextEntry={!showPassword1}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            right={
              <TextInput.Icon
                style={styles.showPasswordIcon}
                icon={showPassword1 ? "eye-off" : "eye"}
                color="black"
                onPress={() => {
                  setShowPassword1(!showPassword1);
                }}
              />
            }
          />

          <Caption>Kata sandi baru</Caption>
          <TextInput
            style={[styles.input, { backgroundColor: "white" }]}
            mode="outlined"
            secureTextEntry={!showPassword2}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            right={
              <TextInput.Icon
                style={styles.showPasswordIcon}
                icon={showPassword2 ? "eye-off" : "eye"}
                color="black"
                onPress={() => {
                  setShowPassword2(!showPassword2);
                }}
              />
            }
          />

          <Caption>Konfirmasi Kata Sandi</Caption>
          <TextInput
            style={[styles.input, { backgroundColor: "white" }]}
            mode="outlined"
            secureTextEntry={!showPassword3}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            right={
              <TextInput.Icon
                style={styles.showPasswordIcon}
                icon={showPassword3 ? "eye-off" : "eye"}
                color="black"
                onPress={() => {
                  setShowPassword3(!showPassword3);
                }}
              />
            }
          />

          <Button
            mode="contained"
            style={{ marginTop: 20, ...Color.primaryBackgroundColor }}
            onPress={handleSubmit}
            disabled={mutationLoading}
            loading={mutationLoading}
          >
            {mutationLoading ? "Menyimpan..." : "Simpan"}
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
});

export default ChangePasswordScreen;
