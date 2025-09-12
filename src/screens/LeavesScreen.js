// App.js
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getLeaves, getLeaveTypes, getStorageItem} from '../utils/Functions';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';
import {appColors} from '../utils/appColors';
import moment from 'moment';

const TABS = ['All', 'Casual', 'Sick'];

const LEAVES = [
  {
    id: '1',
    date: 'Wed, 16 Dec',
    type: 'Casual',
    duration: 'Half Day Application',
    status: 'Awaiting',
    month: 'December 2020',
  },
  {
    id: '2',
    date: 'Mon, 28 Nov',
    type: 'Sick',
    duration: 'Full Day Application',
    status: 'Approved',
    month: 'November 2020',
  },
  {
    id: '3',
    date: 'Tue, 22 Nov - Fri, 25 Nov',
    type: 'Casual',
    duration: '3 Days Application',
    status: 'Declined',
    month: 'November 2020',
  },
  {
    id: '4',
    date: 'Wed, 02 Nov',
    type: 'Sick',
    duration: 'Full Day Application',
    status: 'Approved',
    month: 'November 2020',
  },
];

const LeavesScreen = ({route, navigation}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [page, setPage] = useState(1);

  const [data, setData] = useState([]);
  const [types, setTypes] = useState([]);

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
    navigation.navigate('Profile');
    return true;
  };

  useEffect(() => {
    async function getLeave() {
      const token = await getStorageItem(ACCESS_TOKEN);
      const types = await getLeaveTypes(token);
      if (types?.length > 0) {
        setTypes(types);
      }
    }
    getLeave();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setPage(1);
      getData();
      return () => {
        setPage(1);
      };
    }, [route, selectedTab]),
  );

  const getData = async () => {
    try {
      const user = await getStorageItem(USER_DATA);
      setUser(user);
      const token = await getStorageItem(ACCESS_TOKEN);
      setLoad(true);
      setDisabled(true);
      const resp = await getLeaves(token, selectedTab, 1);
      if (resp?.length > 0) {
        setData(resp);
        setPage(2);
        setTimeout(() => {
          setLoad(false);
          setDisabled(false);
        }, 100);
      } else setLoad(false);
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  const loadMore = async () => {
    if (load || disabled) return;
    try {
      const token = await getStorageItem(ACCESS_TOKEN);
      setLoad(true);
      setDisabled(true);
      const resp = await getLeaves(token, selectedTab, page);
      if (resp?.length > 0) {
        setData([...data, ...resp]);
        setPage(page + 1);
        setTimeout(() => {
          setLoad(false);
          setDisabled(false);
        }, 100);
      } else {
        setLoad(false);
      }
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  const renderLeaveCard = ({item}) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.duration}>{item.days} days</Text>
          <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.date}>{item?.reason}</Text>
        <Text style={styles.type}>{item?.leave_type?.name}</Text>
        <Text style={styles.duration}>
          {moment(item?.start_date).format('DD, MMM yyyy')} -{' '}
          {moment(item?.end_date).format('DD, MMM yyyy')}
        </Text>
      </View>
    );
  };

  const onPressBack = () => {
    //"Profile"
    navigation.navigate('Profile');
  };

  const newLeave = () => {
    navigation.navigate('NewLeave');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E1E4D" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onPressBack}>
          <Icon name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Leaves</Text>
        <View style={styles.icons}>
          {/* <Icon name="notifications-outline" size={24} color="#fff" /> */}
          <TouchableOpacity style={styles.addButton} onPress={newLeave}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 0 && styles.activeTab]}
          onPress={() => setSelectedTab(0)}>
          <Text
            style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>
            {'All'}
          </Text>
        </TouchableOpacity>
        {types.map(tab => (
          <TouchableOpacity
            key={tab?.id}
            style={[styles.tab, selectedTab === tab?.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab?.id)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab?.id && styles.activeTabText,
              ]}>
              {tab?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderLeaveCard}
        contentContainerStyle={styles.list}
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        ListFooterComponent={() =>
          load && <ActivityIndicator size={'large'} color={appColors.primary} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  header: {
    backgroundColor: '#2E1E4D',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#3B237A',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#eee',
    borderRadius: 12,
    overflow: 'hidden',
  },
  backBtn: {
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: appColors.primary,
  },
  tabText: {
    color: '#555',
  },
  activeTabText: {
    color: appColors.white,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#999',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E1E4D',
  },
  type: {
    fontSize: 14,
    color: '#f4b400', // Casual (yellow) or blueish for sick
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  status_approved: {
    backgroundColor: '#34C759',
  },
  status_rejected: {
    backgroundColor: '#FF3B30',
  },
  status_pending: {
    backgroundColor: '#FFD60A',
  },
});

export default LeavesScreen;
