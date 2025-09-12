import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';
import {clearStorage, getProfile, getStorageItem} from '../utils/Functions';
import {useFocusEffect} from '@react-navigation/native';
import { appColors } from '../utils/appColors';

export default function ProfileScreen({route, navigation}) {
  const menuItems = [
    {id: 1, title: 'Payslips', page: 'PaySlips', icon: 'hand-pointer'},
    {id: 2, title: 'Leave Management', page: 'Leaves', icon: 'calendar'},
    {id: 3, title: 'Timesheets', page: 'TimeSheets', icon: 'tasks'},
    {id: 4, title: 'Attendance', page: 'Attendance', icon: 'calendar'},
    // {id: 5, title: 'Meal Management', icon: 'utensils'},
    // {id: 6, title: 'Employees', icon: 'users'},
  ];
  const [user, setUser] = useState(null);
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

  const handleBackButtonClick = () => {
    navigation.navigate('Home');
    return true;
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

  useFocusEffect(
    useCallback(() => {
      getUser();
      () => {};
    }, [route]),
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
    } catch (error) {}
  };
  const openPage = page => {
    if (page) navigation.navigate(page);
  };

  return (
    <LinearGradient colors={['#2C1454', '#1B0E39']} style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        {user?.profile_photo != undefined && (
          <Image source={{uri: user?.profile_photo}} style={styles.avatar} />
        )}
        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.role}>{user?.designation ?? user?.emp_code}</Text>
        {/* <Text style={styles.role}>{user?.joining_date}</Text> */}

        <TouchableOpacity style={styles.editIcon} onPress={logOut}>
          <Icon name="power" size={24} color="#fff" />
          {/* <Icon name="pencil" size={18} color="#fff" /> */}
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => openPage(item?.page)}>
            <View style={styles.menuLeft}>
              <FontAwesome5 name={item.icon} size={18} color="#fff" />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <View style={styles.menuRight}>
              <Icon name="arrow-forward" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  profileCard: {
    backgroundColor: '#2F225B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {fontSize: 20, fontWeight: '600', color: '#fff'},
  role: {fontSize: 14, color: '#aaa', marginBottom: 10},
  editIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: appColors.tertiary,
    padding: 8,
    borderRadius: 20,
  },
  menu: {marginTop: 10},
  menuItem: {
    backgroundColor: '#2F225B',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLeft: {flexDirection: 'row', alignItems: 'center'},
  menuText: {color: '#fff', marginLeft: 10, fontSize: 15, fontWeight: '500'},
  menuRight: {
    backgroundColor: appColors.tertiary,
    padding: 6,
    borderRadius: 20,
  },
});
