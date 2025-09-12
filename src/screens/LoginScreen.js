import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
  Alert,
} from 'react-native';
import {ACCESS_TOKEN, APP_URL, USER_DATA} from '../utils/ApiList';
import {setStorageItem} from '../utils/Functions';
import RequestMake from '../utils/RequestMake';
import {appColors} from '../utils/appColors';

export default function LoginScreen({route, navigation}) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState(1);

  // refs for OTP inputs
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [credentials, setCredentials] = useState({});
  const [load, setLoad] = useState(false);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      };
    }, [route]),
  );

  function handleBackButtonClick() {
    Alert.alert(
      'Exit App',
      'Exiting the application?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    //  navigation.navigate("Home");
    return true;
  }

  useFocusEffect(
    useCallback(() => {
      setStep(1);

      return () => {
        setPhone('');
        setOtp(['', '', '', '']);
        setStep(1);
      };
    }, []),
  );

  const isNotValid = () => {
    let val = true;
    if (credentials?.mobile?.length == 10 && credentials?.password) val = false;
    return val;
  };
  const onPress = async () => {
    if (!phone) {
      ToastAndroid.show('Enter mobile number.', ToastAndroid.SHORT);
      return;
    }
    if (load) return;
    setLoad(true);
    let URL = APP_URL + 'login';
    try {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phone}),
      };
      const result = await RequestMake(URL, requestOptions);
      setLoad(false);
      if (result?.success == 1) {
        ToastAndroid.show(result?.message, ToastAndroid.SHORT);
        setStep(2);
      } else {
        alert(result?.message);
      }
    } catch (error) {
      setLoad(false);
    }
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     login();
  //   }, []),
  // );

  const resendOtp = async () => {
    if (!phone) {
      ToastAndroid.show('Enter mobile number.', ToastAndroid.SHORT);
      return;
    }
    if (load) return;
    setLoad(true);
    let URL = APP_URL + 'resendOtp';
    try {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phone}),
      };
      const result = await RequestMake(URL, requestOptions);
      setLoad(false);
      if (result?.success == 1) {
        ToastAndroid.show(result?.message, ToastAndroid.SHORT);
        setStep(2);
      } else {
        alert(result?.message);
      }
    } catch (error) {
      setLoad(false);
    }
  };

  const handleOtpChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      otpRefs[index + 1].current.focus(); // move to next
    }
    if (!text && index > 0) {
      otpRefs[index - 1].current.focus(); // backspace → previous
    }
  };

  const login = async () => {
    const newOTP = otp.join('');
    if (!newOTP) {
      ToastAndroid.show('Enter OTP.', ToastAndroid.SHORT);
      return;
    }
    if (load) return;
    setLoad(true);
    let URL = APP_URL + 'verifyMobile';
    try {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mobile: phone, otp: newOTP}),
      };
      const result = await RequestMake(URL, requestOptions);
      setLoad(false);
      if (result?.success == 1) {
        ToastAndroid.show(result?.message, ToastAndroid.SHORT);
        setStep(1);
        let user =
          result?.data?.user?.data?.length > 0
            ? result?.data?.user?.data?.[0]
            : null;

        await setStorageItem(USER_DATA, JSON.stringify(user));
        await setStorageItem(ACCESS_TOKEN, result?.data?.token);
        navigation.navigate('Home');
      } else {
        alert(result?.message);
      }
    } catch (error) {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? 'Login with your phone number'
            : 'Enter the OTP we sent'}
        </Text>
      </View>

      {step === 1 ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            placeholderTextColor="#BBAAFF"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <View style={styles.form}></View>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            {load ? (
              <ActivityIndicator color={appColors.white} />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={otpRefs[index]}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
              />
            ))}
          </View>
          <View style={styles.form}></View>
          <TouchableOpacity style={styles.button} onPress={login}>
            {load ? (
              <ActivityIndicator color={appColors.white} />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn} onPress={resendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1B1035', // Dark purple base
  },
  header: {
    marginTop: 50,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#BBAAFF',
    marginTop: 6,
  },
  form: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#2E1E4D',
    color: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3B237A',
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  otpInput: {
    backgroundColor: '#2E1E4D',
    borderRadius: 10,
    width: 60,
    height: 60,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3B237A',
  },
  resendBtn: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
