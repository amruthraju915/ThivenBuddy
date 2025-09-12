import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {getStorageItem, submitTimeSheets} from '../utils/Functions';
import {ACCESS_TOKEN, USER_DATA} from '../utils/ApiList';

export default function AddTimeSheet({route, navigation}) {
  const [workDate, setWorkDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  const [sheets, setSheets] = useState([
    {title: '', description: '', hours: ''},
  ]);

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
    navigation.navigate('TimeSheets');
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      setSheets([{title: '', description: '', hours: ''}]);
    }, [route]),
  );

  const handleAddSheet = () => {
    setSheets([...sheets, {title: '', description: '', hours: ''}]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...sheets];
    updated[index][field] = value;
    setSheets(updated);
  };

  const handleSubmit = async () => {
    if (load) return;
    const data = {
      work_date: workDate.toISOString().split('T')[0], // yyyy-mm-dd
      sheets: sheets.map(s => ({
        title: s.title || 'Manual hours entry',
        description: s.description || 'Employee entered hours manually',
        hours: parseFloat(s.hours) || 0,
      })),
    };
    try {
      const user = await getStorageItem(USER_DATA);
      setUser(user);
      const token = await getStorageItem(ACCESS_TOKEN);
      setLoad(true);
      const resp = await submitTimeSheets(token, data);
      setLoad(false);
      if (resp?.success == 1) {
        ToastAndroid.show(resp?.message, ToastAndroid.SHORT);
        navigation.navigate('TimeSheets');
      } else alert(resp?.message);
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Icon name="chevron-back" size={22} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Submit Timesheet</Text>
        <View style={{width: 22}} />
        {/* placeholder for spacing */}
      </View>
      <ScrollView>
        {/* Work Date */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(false)}>
          <Text style={{color: '#fff'}}>
            {workDate ? workDate.toDateString() : 'Select Work Date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={workDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setWorkDate(selectedDate);
            }}
          />
        )}

        {/* Sheets */}
        {sheets.map((sheet, index) => (
          <View key={index} style={styles.sheetCard}>
            <Text style={styles.sectionTitle}>Sheet {index + 1}</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#BBAAFF"
              value={sheet.title}
              onChangeText={val => handleInputChange(index, 'title', val)}
            />

            <TextInput
              style={[styles.input, {height: 70, textAlignVertical: 'top'}]}
              placeholder="Description"
              placeholderTextColor="#BBAAFF"
              multiline
              value={sheet.description}
              onChangeText={val => handleInputChange(index, 'description', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Hours Worked"
              placeholderTextColor="#BBAAFF"
              keyboardType="numeric"
              value={sheet.hours.toString()}
              onChangeText={val => handleInputChange(index, 'hours', val)}
            />
          </View>
        ))}

        {/* Add More Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddSheet}>
          <Text style={styles.addText}>+ Add More</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveText}>
            {load ? 'Submiting...' : 'Submit Timesheet'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  headerText: {fontSize: 18, fontWeight: '600', color: '#FFFF'},
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BBAAFF',
    marginBottom: 8,
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
  sheetCard: {
    backgroundColor: '#2A1845',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: '#2E1E4D',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  addText: {
    color: '#BBAAFF',
    fontSize: 14,
    fontWeight: '600',
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
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
