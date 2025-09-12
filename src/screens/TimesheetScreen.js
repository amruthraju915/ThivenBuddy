import {useFocusEffect} from '@react-navigation/native';
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
import {getStorageItem, getTimeSheets} from '../utils/Functions';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';
import {appColors} from '../utils/appColors';
import Icon from 'react-native-vector-icons/Ionicons';

const filters = ['Today', 'Yesterday', 'Week', 'Month', 'Year'];

const getStatusStyle = status => {
  switch (status) {
    case 'approved':
      return {backgroundColor: '#00C9A7'};
    case 'pending':
      return {backgroundColor: '#FFA133'};
    case 'rejected':
      return {backgroundColor: '#FF4C61'};
    default:
      return {backgroundColor: '#777'};
  }
};

export default function TimesheetScreen({route, navigation}) {
  const [selectedFilter, setSelectedFilter] = useState('Today');

  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [page, setPage] = useState(1);

  const [data, setData] = useState([]);


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
    }, [route, selectedFilter]),
  );

  const getData = async () => {
    try {
      const user = await getStorageItem(USER_DATA);
      setUser(user);
      const token = await getStorageItem(ACCESS_TOKEN);
      const range = selectedFilter?.toLowerCase();
      setLoad(true);
      setDisabled(true);
      const resp = await getTimeSheets(token, range, 1);
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
      const range = selectedFilter?.toLowerCase();
      setLoad(true);
      setDisabled(true);
      const resp = await getTimeSheets(token, range, page);
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
  const addSheet = () => navigation.navigate('AddTimesheet');

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.project}>{item.title}</Text>
        <View style={[styles.statusTag, getStatusStyle(item.approval_status)]}>
          <Text style={styles.statusText}>{item.approval_status}</Text>
        </View>
      </View>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.hours}>Worked Hours: {item.hours}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.header}>Timesheets</Text> */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon name="chevron-back" size={22} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Timesheets</Text>
        <View style={{width: 22}} />
        {/* placeholder for spacing */}
      </View>
      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterBtn,
              selectedFilter === filter && styles.filterBtnActive,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 60}}
        onEndReachedThreshold={0.01}
        onEndReached={loadMore}
        ListFooterComponent={() =>
          load && <ActivityIndicator size={'large'} color={appColors.white} />
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={addSheet}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1B1035',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  headerText: {fontSize: 18, fontWeight: '600', color: '#FFFF'},
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#2E1E4D',
    marginRight: 8,
    marginBottom: 10,
  },
  filterBtnActive: {
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  filterText: {
    color: '#BBAAFF',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
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
  project: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#BBAAFF',
    fontSize: 13,
    marginTop: 4,
  },
  hours: {
    color: '#9998C5',
    fontSize: 13,
    marginTop: 2,
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
    textTransform: 'capitalize',
  },
  fab: {
    backgroundColor: '#6C63FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    right: 25,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
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
