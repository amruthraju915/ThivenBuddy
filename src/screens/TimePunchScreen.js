import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { usePunchMutation } from '../api/attendanceApi';

const QUEUE_KEY = '@attendance_queue_v1';

export default function TimePunchScreen() {
  const user = useSelector((state) => state.auth.user);
  const [punch, { isLoading }] = usePunchMutation();
  const [lastPunch, setLastPunch] = useState(null);

  useEffect(() => {
    // try to sync queue on mount
    syncQueue();
  }, []);

  async function syncQueue() {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY);
      if (!raw) return;
      const queue = JSON.parse(raw);
      for (const item of queue) {
        try {
          await punch(item).unwrap();
        } catch (e) {
          console.warn('Queue item failed to send:', e);
          return;
        }
      }
      await AsyncStorage.removeItem(QUEUE_KEY);
      Alert.alert('Sync', 'Queued punches synced successfully.');
    } catch (e) {
      console.warn('syncQueue error', e);
    }
  }

  const doPunch = async (type) => {
    const payload = {
      userId: user?.id,
      type,
      timestamp: new Date().toISOString(),
    };
    setLastPunch(payload);
    try {
      await punch(payload).unwrap();
      Alert.alert('Success', `Time ${type} recorded`);
    } catch (err) {
      console.log('Punch failed, queuing offline:', err);
      const existing = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = existing ? JSON.parse(existing) : [];
      queue.push(payload);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      Alert.alert('Offline', 'Punch saved locally, will sync later.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Attendance</Text>
      <Text>Last Punch: {lastPunch ? `${lastPunch.type} at ${lastPunch.timestamp}` : 'None'}</Text>
      {isLoading ? <ActivityIndicator /> : (
        <>
          <Button title="Time In" onPress={() => doPunch('in')} />
          <View style={{ height: 10 }} />
          <Button title="Time Out" onPress={() => doPunch('out')} />
        </>
      )}
    </View>
  );
}
