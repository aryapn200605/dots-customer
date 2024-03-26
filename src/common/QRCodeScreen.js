import React from "react";
import { Appbar } from "react-native-paper";
import { View, StyleSheet, Text } from "react-native";
import { API_URL } from '@env'
import QRCode from 'react-native-qrcode-svg';

const QRCodeScreen = ({route, navigation}) => {
    const { selectedNotification } = route.params;

  return (
    <>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="QR Code" />
      </Appbar.Header>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {selectedNotification ? (
        <View>
            <Text style={{alignItems: 'center'}}>Scan QR Code</Text>
          <QRCode
            value={API_URL + "/qrcode/" + selectedNotification.id}
            size={300}
          />
        </View>
      ) : (
        <Text>Tidak ada data reservasi yang tersedia.</Text>
      )}
    </View>         
    </>
  );
};

const styles = StyleSheet.create({
    appbarHeader: {
        elevation: 0,
        backgroundColor: "#F5F8FB",
        alignItems: "center"
      },
})


export default QRCodeScreen;
