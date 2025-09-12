// NewLeaveScreen.js
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {appColors} from '../utils/appColors';
import {useFocusEffect} from '@react-navigation/native';
import {
  getLeaves,
  getLeaveTypes,
  getStorageItem,
  submitLeave,
} from '../utils/Functions';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';

const NewLeaveScreen = ({route, navigation}) => {
  const [leaveType, setLeaveType] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [types, setTypes] = useState([]);
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
      navigation.navigate('Leaves');
      return true;
    };

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        const token = await getStorageItem(ACCESS_TOKEN);
        const types = await getLeaveTypes(token);
        if (types?.length > 0) {
          setTypes(types);
          setLeaveType(types?.[0]?.id);
        }
      }
      getData();
    }, [route]),
  );

  const handleSubmit = async () => {
    if (!leaveType) {
      ToastAndroid.show('Select Leave Type', ToastAndroid.SHORT);
      return;
    }
    if(!reason) {
      ToastAndroid.show('Enter Reason', ToastAndroid.SHORT);
      return;
    }
    if (load) return;
    const data = {
      leave_type_id: leaveType,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      reason: reason,
    };
    try {
      const user = await getStorageItem(USER_DATA);
      setUser(user);
      const token = await getStorageItem(ACCESS_TOKEN);
      setLoad(true);
      const resp = await submitLeave(token, data);
      setLoad(false);
      if (resp?.success == 1) {
        ToastAndroid.show(resp?.message, ToastAndroid.SHORT);
        navigation.navigate('Leaves');
      } else alert(resp?.message);
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  const onPressBack = () => {
    navigation.navigate('Leaves');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon name="chevron-back" size={24} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Apply for Leave</Text>
        <View style={{width: 24}} />
        {/* placeholder for spacing */}
      </View>
      <ScrollView>
        {/* Leave Type Picker */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Leave Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={leaveType}
              dropdownIconColor="#fff"
              style={styles.picker}
              onValueChange={itemValue => setLeaveType(itemValue)}>
              {types?.map((item, index) => (
                <Picker.Item
                  key={item?.id}
                  label={item?.name}
                  value={item?.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Start Date */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartPicker(true)}>
          <Text style={{color: '#fff'}}>
            {startDate ? startDate.toDateString() : 'Select Start Date'}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {/* End Date */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndPicker(true)}>
          <Text style={{color: '#fff'}}>
            {endDate ? endDate.toDateString() : 'Select End Date'}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}

        {/* Reason */}
        <TextInput
          style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
          placeholder="Reason for Leave"
          placeholderTextColor="#BBAAFF"
          multiline
          value={reason}
          onChangeText={setReason}
        />

        {/* Submit Button */}
        <TouchableOpacity
          disabled={load}
          style={styles.saveBtn}
          onPress={handleSubmit}>
          {load ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <Text style={styles.saveText}>Submit Leave</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewLeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1035',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  headerText: {fontSize: 22, fontWeight: '600', color: '#FFFF'},
  label: {
    color: '#BBAAFF',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  pickerWrapper: {
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: '#2E1E4D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3E2F6D',
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
  input: {
    backgroundColor: '#2E1E4D',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3E2F6D',
  },
  dropdown: {
    marginBottom: 15,
  },
  dropdownLabel: {
    color: '#BBAAFF',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownButton: {
    backgroundColor: '#2E1E4D',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3E2F6D',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
