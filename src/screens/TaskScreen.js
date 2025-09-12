import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const tasks = [
  {
    id: '1',
    title: 'Customer Service',
    date: 'March 25 - 12:00 PM',
    status: 'InProgress',
  },
  {
    id: '2',
    title: 'Admin Assistance',
    date: 'March 25 - 12:00 PM',
    status: 'Completed',
  },
  {id: '3', title: 'Cashier', date: 'March 25 - 12:00 PM', status: 'Pending'},
  {
    id: '4',
    title: 'Customer Service',
    date: 'March 25 - 12:00 PM',
    status: 'InProgress',
  },
  {
    id: '5',
    title: 'Admin Assistance',
    date: 'March 25 - 12:00 PM',
    status: 'Completed',
  },
];

const getStatusStyle = status => {
  switch (status) {
    case 'InProgress':
      return {backgroundColor: '#6C63FF'}; // purple
    case 'Completed':
      return {backgroundColor: '#00C9A7'}; // teal
    case 'Pending':
      return {backgroundColor: '#FF6B6B'}; // red/pink
    default:
      return {backgroundColor: '#999'};
  }
};

export default function TaskScreen({route,navigation}) {


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

  const goBack = () => navigation.goBack();
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.statusTag, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.subText}>For Zoho Project</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={22} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tasks</Text>
        <View style={{width: 22}} />
        {/* placeholder for spacing */}
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 100}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1035', // deep purple background
    padding: 15,
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#BBAAFF',
    fontSize: 13,
    marginTop: 4,
  },
  subText: {
    color: '#9998C5',
    fontSize: 12,
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
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  navBtn: {
    paddingHorizontal: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
});
