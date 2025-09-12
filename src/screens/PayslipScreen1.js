import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetPayslipsQuery } from '../api/attendanceApi';

export default function PayslipScreen1() {
  const user = useSelector((state) => state.auth.user);
  const { data: payslips = [], isLoading } = useGetPayslipsQuery(user?.id);1

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Payslips</Text>
      {isLoading && <Text>Loading...</Text>}
      <FlatList
        data={payslips}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => item.pdf_url && Linking.openURL(item.pdf_url)}>
            <Text style={{ padding: 8 }}>{item.period_start} - {item.period_end} (Net: {item.net})</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No payslips yet.</Text>}
      />
    </View>
  );
}
