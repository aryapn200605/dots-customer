import React, { useState, useEffect, useContext } from "react";
import DropDown from "react-native-paper-dropdown";
import { useToast } from "react-native-paper-toast";
import {
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { findAllOffices } from "../../api/OfficeApi";
import { View, StyleSheet, ScrollView } from "react-native";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Appbar, Caption, Button, Text } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import createReservation, {
  createReservationRest,
  findReservationtime,
} from "../../api/ReservationApi";

const AttendanceReservationScreen = ({ navigation }) => {
  const { token, handleCheckToken } = useContext(AuthContext);

  const [destinationService, setDestinationService] = useState(null);
  const [showDropDownService, setshowDropDownService] = useState(false);
  const [Service, setService] = useState(null);
  const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
  const [office, setOffice] = useState(null);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [officesData, setOfficeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDestinationService, setShowDestinationService] = useState(false);
  const [showAttendanceTimeRange, setShowAttendanceTimeRange] = useState(false);
  const [attendanceTimeRange, setAttendanceTimeRange] = useState(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [generateTimeList, setGenerateTimeList] = useState([]);

  const currentLocalTime = new Date();
  const [date, setDate] = useState(
    intTime < 15
      ? currentLocalTime
      : new Date(currentLocalTime.getTime() + 86400000)
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const toaster = useToast();

  const destinationServices = [
    { label: "Teller", value: "1" },
    { label: "Customer Service", value: "2" },
    { label: "Lainnya", value: "3   " },
  ];

  const dataService = [
    {
      label: "Pengajuan",
      value: "Pengajuan",
    },
    {
      label: "Pembayaran",
      value: "Pembayaran",
    },
    {
      label: "Keluhan",
      value: "Keluhan",
    },
    {
      label: "Lainnya",
      value: "Lainnya",
    },
  ];

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const intTime =
    currentLocalTime.getHours() + currentLocalTime.getMinutes() / 60;

  const fetchDate = async (time) => {
    setDate(time);

    findReservationtime(token, {
      branchId: office,
      destinationService: destinationService,
      reason: Service,
      time: time,
    })
      .then((response) => {
        setGenerateTimeList(response.data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      findAllOffices(token).then((result) => {
        setOfficeData(result.data.data);
      });
    } catch (error) {
      console.error("Error fetching offices: ", error);
      setError(error);
      setLoading(false);
      toaster.show({ message: "Gagal mendapatkan data kantor" });
    }
  };

  const onSubmitForm = () => {
    if (!mutationLoading) {
      if (!office) {
        Alert.alert("Kesalahan", "Kantor Tujuan diperlukan");
      } else if (!destinationService) {
        Alert.alert("Kesalahan", "Layanan Tujuan diperlukan");
      } else if (!Service) {
        Alert.alert("Kesalahan", "Tujuan Kedatangan diperlukan");
      } else if (!attendanceTimeRange) {
        Alert.alert("Kesalahan", "Waktu Kedatangan diperlukan");
      } else {
        setMutationLoading(true);
        createReservationRest(
          token,
          {
            branchId: office,
            destinationService: destinationService,
            reason: Service,
            attendAtStart: attendanceTimeRange,
            attendAtEnd: date,
          },
          setMutationLoading
        )
          .then((res) => {
            setMutationLoading(false);

            if (res.data.message == "Success") {
              navigation.navigate("Home");
              Alert.alert(
                "Sukses",
                "Berhasil Mengajukan Reservasi. Silahkan cek notifikasi secara berkala"
              );
            } else {
              Alert.alert("Tidak dapat melakukan reservasi", res.data.message);
            }
            console.log(res.data.message);
          })
          .catch((err) => {
            Alert.alert("Error", "Failed to create reservation");
          });
      }
    }
  };

  if (error) {
    toaster.show({ message: "Gagal mendapatkan data kantor" });
  }

  useEffect(() => {
    handleCheckToken();
    fetchData();
  }, []);

  useEffect(() => {
    setGenerateTimeList([]);
    setAttendanceTimeRange(null);
    console.log(generateTimeList);
  }, [office, destinationService]);

  const touchableOpacityStyle = Platform.select({
    ios: {
      // Gaya spesifik iOS
      paddingVertical: 10,
    },
    android: {
      // Gaya spesifik Android
    },
  });

  return (
    <>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Reservasi Kedatangan" />
      </Appbar.Header>
      <ScrollView style={styles.screen}>
        {mutationLoading && <LoadingOverlay />}
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 18,
          }}
        >
          <Caption>Kantor Tujuan</Caption>
          <DropDown
            dropDownStyle={{ marginTop: 20 }}
            style={{ backgroundColor: "white" }}
            placeholder={!officesData.length ? "Loading..." : null}
            mode={"outlined"}
            value={office}
            setValue={setOffice}
            list={
              officesData && officesData.length > 0
                ? officesData.map((index) => ({
                    label: index.name,
                    value: index.id,
                  }))
                : []
            }
            visible={showOfficeDropdown}
            showDropDown={() => setShowOfficeDropdown(true)}
            onDismiss={() => setShowOfficeDropdown(false)}
            inputProps={{
              right: loading ? null : <TextInput.Icon name={"menu-down"} />,
            }}
          />
          <Caption>Layanan Tujuan</Caption>
          <DropDown
            dropDownStyle={{ marginTop: 20 }}
            style={{ backgroundColor: "white" }}
            mode={"outlined"}
            value={destinationService}
            setValue={setDestinationService}
            list={destinationServices}
            visible={showDestinationService}
            showDropDown={() => setShowDestinationService(true)}
            onDismiss={() => setShowDestinationService(false)}
            inputProps={{
              right: <TextInput.Icon name={"menu-down"} />,
            }}
          />
          <Caption>Tujuan Kedatangan</Caption>
          <DropDown
            dropDownStyle={{ marginTop: 20 }}
            style={{ backgroundColor: "white" }}
            mode={"outlined"}
            visible={showDropDownService}
            showDropDown={() => setshowDropDownService(true)}
            onDismiss={() => setshowDropDownService(false)}
            value={Service}
            setValue={setService}
            list={dataService}
          />
          <Caption>Tanggal Kedatangan</Caption>
          <TextInput
            style={{
              height: 55,
              marginBottom: 5,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#ccc",
            }}
            editable={false}
            mode="outlined"
            value={date.toLocaleDateString("id-ID", options)}
            right={
              <TextInput.Icon
                icon={"calendar"}
                color="black"
                disabled={!office || !destinationService || !Service}
                onPress={() => {
                  setShowDatepicker(true);
                }}
              />
            }
          />

          {showDatepicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={tomorrow}
              is24Hour={true}
              visible={showDatepicker}
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const selectedDayOfWeek = selectedDate.getDay();
                  if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
                    Alert.alert(
                      "Peringatan",
                      "Tidak dapat memilih hari Sabtu dan Minggu"
                    );
                    setShowDatepicker(false);
                    return;
                  }
                }
                const currentDate = selectedDate || date;
                setShowDatepicker(Platform.OS === "ios");
                fetchDate(currentDate);
              }}
            />
          )}

          {generateTimeList && generateTimeList.length > 0 ? (
            <>
              <Caption>Waktu Kedatangan</Caption>
              <DropDown
                dropDownStyle={{ marginTop: 20 }}
                style={{ backgroundColor: "white" }}
                placeholder={!generateTimeList.length ? "Loading..." : null}
                mode={"outlined"}
                value={
                  attendanceTimeRange === null ? null : attendanceTimeRange
                }
                setValue={setAttendanceTimeRange}
                list={generateTimeList}
                visible={showAttendanceTimeRange}
                showDropDown={() => setShowAttendanceTimeRange(true)}
                onDismiss={() => setShowAttendanceTimeRange(false)}
                inputProps={{
                  right: <TextInput.Icon name={"menu-down"} />,
                }}
              />
            </>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingTop: 5,
            }}
          >
            <Text
              style={{
                width: 20,
                textAlign: "center",
                alignSelf: "flex-start",
                color: "red",
              }}
            >
              *
            </Text>
            <Text style={{ flex: 1, color: "red" }}>
              Apabila merubah Kantor atau Layanan Tujuan diharapkan untuk
              memilih kembali tanggal kedatangan untuk memunculkan waktu
              kedatangan
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={() => onSubmitForm()}
            style={{ marginTop: 20, ...Color.primaryBackgroundColor }}
            disabled={mutationLoading}
            loading={mutationLoading}
          >
            {mutationLoading ? "Mengirim..." : "Kirim"}
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flex: 1,
  },
  heading: {
    marginTop: "10%",
    marginBottom: "4%",
    fontSize: 30,
    marginLeft: "5%",
    paddingBottom: "2%",
    color: "white",
  },
  settingMenuButton: {
    backgroundColor: "white",
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
});

export default AttendanceReservationScreen;
