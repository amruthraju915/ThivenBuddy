import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStorageItem, getWorkSession} from '../utils/Functions';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';
import {appColors} from '../utils/appColors';
import moment from 'moment';

export default function AttendanceHistory({route, navigation}) {
  const [activeTab, setActiveTab] = useState('Week');
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [page, setPage] = useState(1);

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

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

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setPage(1);
      getData();
      return () => {
        setPage(1);
      };
    }, [route, activeTab]),
  );

  const changeTab = tab => {
    setActiveTab(tab);
  };
  const getData = async () => {
    try {
      const user = await getStorageItem(USER_DATA);
      setUser(user);
      const token = await getStorageItem(ACCESS_TOKEN);
      const range = activeTab?.toLowerCase();
      setLoad(true);
      setDisabled(true);
      const resp = await getWorkSession(token, range, 1);
      if (resp?.data?.length > 0) {
        setData(resp?.data);
        setSummary(resp?.summary);
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
    console.log('loadmore');
    try {
      const token = await getStorageItem(ACCESS_TOKEN);
      const range = activeTab?.toLowerCase();
      setLoad(true);
      setDisabled(true);
      const resp = await getWorkSession(token, range, page);
      if (resp?.data?.length > 0) {
        setData([...data, ...resp?.data]);
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

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Icon name="exit-outline" size={22} color="#1e88e5" />
        <View style={{marginLeft: 10}}>
          {item.work_date != null && (
            <Text style={styles.shiftType}>
              {moment(item.work_date).format('DD, MMM yyyy')}
            </Text>
          )}
          {item.time_in != null && (
            <Text style={styles.date}>
              Time: {moment(item.time_out).format('hh:mm A')}
              {item.time_out != null
                ? ' - ' + moment(item.time_out).format('hh:mm A')
                : ''}
            </Text>
          )}
          {item.work_date != null && (
            <Text style={styles.date}>{item.note ?? item?.work_date}</Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{item.worked_minutes}</Text>
        {/* <Text style={[styles.status, {color: item.statusColor}]}>
          {item.status}
        </Text> */}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#2C1454', '#1B0E39']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon name="chevron-back" size={22} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Attendance</Text>
        <View style={{width: 22}} />
        {/* placeholder for spacing */}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Week', 'Month', 'Year'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => changeTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Attendance Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Attendance for&nbsp;</Text>
        <Text style={styles.summaryHighlight}>{activeTab}</Text>
        <Text style={styles.summaryText}> | Total Hours</Text>
        <Text style={styles.summaryHighlight}> {summary?.total_hours}</Text>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index + 1 + '-' + item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 60}}
        onEndReachedThreshold={0.01}
        onEndReached={loadMore}
        ListFooterComponent={() =>
          load && <ActivityIndicator size={'large'} color={appColors.white} />
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  headerText: {fontSize: 18, fontWeight: '600', color: '#FFFF'},
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {backgroundColor: '#1e88e5'},
  tabText: {color: '#555', fontWeight: '500'},
  activeTabText: {color: '#fff'},
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  summaryText: {color: '#555', fontSize: 14},
  summaryHighlight: {color: '#1e88e5', fontSize: 14, fontWeight: '600'},
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2F225B',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  left: {flexDirection: 'row', alignItems: 'center'},
  shiftType: {fontSize: 15, fontWeight: '600', color: '#FFF'},
  date: {fontSize: 12, color: '#777'},
  right: {alignItems: 'flex-end'},
  time: {fontSize: 14, fontWeight: '600', color: '#FFF'},
  status: {fontSize: 12, marginTop: 2},
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2F225B',
    borderRadius: 16,
    padding: 15,
  },
});
