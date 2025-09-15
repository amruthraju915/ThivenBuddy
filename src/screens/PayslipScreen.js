import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {appColors} from '../utils/appColors';
import {getLeaves, getPayslips, getStorageItem} from '../utils/Functions';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';
import {useFocusEffect} from '@react-navigation/native';


const getStatusStyle = status => {
  switch (status) {
    case 'issued':
      return {backgroundColor: '#00C9A7'}; // teal
    case 'pending':
      return {backgroundColor: '#FFA133'}; // orange
    case 'failed':
      return {backgroundColor: '#FF4C61'}; // red
    default:
      return {backgroundColor: '#777'};
  }
};

export default function PayslipScreen({route, navigation}) {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [page, setPage] = useState(1);

  const [payslips, setData] = useState([]);

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

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setPage(1);
      getData();
      return () => {
        setPage(1);
      };
    }, [route]),
  );

  const getData = async () => {
    try {
      const user = await getStorageItem(USER_DATA);
      setUser(user);
      const token = await getStorageItem(ACCESS_TOKEN);
      setLoad(true);
      setDisabled(true);
      const resp = await getPayslips(token, 1);
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
      const resp = await getPayslips(token, page);
      if (resp?.length > 0) {
        setData([...payslips, ...resp]);
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

  const goBack = () => navigation.navigate('Profile');

  const viewSlip = item => {
    navigation.navigate('PaySlip', {item: item});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card} onPress={() => viewSlip(item)}>
      <View style={styles.row}>
        <Text style={styles.month}>{item.period_month}</Text>
        <View style={[styles.statusTag, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.amount}>&#8377;{item.net_pay}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="chevron-back" size={22} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payslips</Text>
        <View style={{width: 22}} />
        {/* placeholder for spacing */}
      </View>

      <FlatList
        data={payslips}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 10}}
        onEndReachedThreshold={0.01}
        onEndReached={loadMore}
        ListFooterComponent={() =>
          load && <ActivityIndicator size={'large'} color={appColors.white} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1B1035', // dark purple background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 25,
  },
  headerText: {fontSize: 18, fontWeight: '600', color: '#FFFF'},
  card: {
    backgroundColor: '#2E1E4D',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    color: '#BBAAFF',
    fontSize: 14,
    marginTop: 6,
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E1E4D',
    paddingVertical: 12,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navBtn: {
    paddingHorizontal: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
});
