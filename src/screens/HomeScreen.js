import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  BackHandler,
  ToastAndroid,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native';
import {ACCESS_TOKEN, APP_URL, USER_DATA} from '../utils/ApiList';
import {clearStorage, getProfile, getStorageItem} from '../utils/Functions';
import moment from 'moment';
import RequestMake from '../utils/RequestMake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appColors} from '../utils/appColors';

export default function HomeScreen({route, navigation}) {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getUser();
      () => {};
    }, []),
  );

  const getUser = async () => {
    try {
      let user = await getStorageItem(USER_DATA);
      setUser(user);
      let token = await getStorageItem(ACCESS_TOKEN);
      let data = await getProfile(token);
      if (data?.full_name) {
        setUser(data);
      }
    } catch (error) {
      navigation.navigate('SignIn');
    }
  };

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

  const signIn = async () => {
    setLoad(true);
    let URL =
      user?.clock_status == 'clocked_in'
        ? APP_URL + 'clock-out'
        : APP_URL + 'clock-in'; // clock-out

    const note =
      user?.clock_status == 'clocked_in'
        ? 'Stop office shift'
        : 'Start morning shift';
    try {
      let token = await getStorageItem(ACCESS_TOKEN);
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({note: note}),
      };
      const result = await RequestMake(URL, requestOptions);
      setLoad(false);
      if (result?.success == 1) {
        ToastAndroid.show(result?.message, ToastAndroid.SHORT);
        let data = await getProfile(token);
        if (data?.full_name) {
          setUser(data);
        }
      } else {
        alert(result?.message);
      }
    } catch (error) {
      setLoad(false);
    }
  };

  const logOut = () => {
    Alert.alert(
      'Logout',
      'Do you want logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => logout(),
        },
      ],
      {
        cancelable: false,
      },
    );
  };
  const logout = async () => {
    await clearStorage();
    navigation.navigate('SignIn');
  };

  return (
    <LinearGradient colors={['#2C1454', '#1B0E39']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profile}>
          {user?.profile_photo != undefined && (
            <Image source={{uri: user?.profile_photo}} style={styles.avatar} />
          )}
          {/* <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View> */}
        </View>
        <TouchableOpacity onPress={logOut}>
          <Icon name="power" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Hi {user?.full_name},</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Icon name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* Attendance Card */}
      <View style={styles.card}>
        <Text style={styles.time}>{moment(new Date()).format('hh: mm A')}</Text>
        <Text style={styles.date}>
          {moment(new Date()).format('ddd, MMM d')}
        </Text>

        <TouchableOpacity activeOpacity={0.8} onPress={signIn}>
          <LinearGradient
            colors={[appColors.tertiary, '#2575FC']}
            style={styles.punchButton}>
            <FontAwesome5 name="hand-pointer" size={28} color="#fff" />
            <Text style={styles.punchText}>
              {user?.clock_status == 'clocked_in' ? 'CLOCK OUT' : 'CLOCK IN'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* <Text style={styles.location}>
          <Icon name="location" size={14} color="#fff" /> You are in Office
          reach
        </Text> */}
      </View>

      {/* Attendance Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Icon name="log-in" size={20} color="#0af" />
          <Text style={styles.detailTime}>
            {user?.time_in ? moment(user?.time_in).format('hh:mm A') : '--:--'}
          </Text>
          <Text style={styles.detailLabel}>Check In</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="log-out" size={20} color="#fa0" />
          <Text style={styles.detailTime}>
            {user?.time_out
              ? moment(user?.time_out).format('hh:mm A')
              : '--:--'}
          </Text>
          <Text style={styles.detailLabel}>Check Out</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="time" size={20} color="#0ff" />
          <Text style={styles.detailTime}>
            {user?.today_hours ? user?.today_hours : '--:--'}
          </Text>
          <Text style={styles.detailLabel}>Working Hrs</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {position: 'relative'},
  avatar: {width: 45, height: 45, borderRadius: 30},
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: appColors.tertiary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {color: '#fff', fontSize: 12},
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F225B',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 20,
  },
  searchInput: {color: '#fff', flex: 1, marginLeft: 8},
  card: {
    backgroundColor: '#2F225B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  time: {fontSize: 22, fontWeight: 'bold', color: '#fff'},
  date: {fontSize: 14, color: '#aaa', marginBottom: 15},
  punchButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  punchText: {color: '#fff', marginTop: 8, fontWeight: '600'},
  location: {color: '#bbb', fontSize: 12},
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2F225B',
    borderRadius: 16,
    padding: 15,
  },
  detailItem: {alignItems: 'center', flex: 1},
  detailTime: {color: '#fff', marginTop: 5, fontSize: 14, fontWeight: '600'},
  detailLabel: {color: '#aaa', fontSize: 12},
});
