import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getStorageItem} from '../utils/Functions';
import {ACCESS_TOKEN} from '../utils/ApiList';

export default function WelcomeScreen({navigation}) {
  useFocusEffect(
    useCallback(() => {
      getUser();
      () => {};
    }, []),
  );

  const getUser = async () => {
    try {
      let token = await getStorageItem(ACCESS_TOKEN);
      if (token) navigation.navigate('Home');
      else navigation.navigate('SignIn');
    } catch (error) {
      navigation.navigate('SignIn');
    }
  };

  return (
    <LinearGradient
      colors={['#1B1035', '#2E1E4D', '#6C63FF']}
      style={styles.container}>
      <SafeAreaView style={styles.inner}>
        {/* App Logo / Illustration */}
        <View style={styles.logoBox}>
          {/* <Image
            source={require('../assets/logo.png')} // replace with your logo
            style={styles.logo}
            resizeMode="contain"
          /> */}
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome to WorkTrack</Text>
        <Text style={styles.subtitle}>
          Manage your tasks, timesheets, and payslips with ease 🚀
        </Text>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.loginBtn]}
            onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.btn, styles.signupBtn]}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logoBox: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#BBAAFF',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  loginBtn: {
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  signupBtn: {
    backgroundColor: '#2E1E4D',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
