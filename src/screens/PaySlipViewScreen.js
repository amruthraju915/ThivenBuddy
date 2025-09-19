import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {generatePDF} from 'react-native-html-to-pdf';

export default function PaySlipViewScreen({route, navigation}) {
  // Sample data (can come from API)
  const payslip = {
    employee_name: route?.params?.item?.staff?.name,
    employee_id: route?.params?.item?.staff?.emp_code,
    department: route?.params?.item?.staff?.department,
    designation: route?.params?.item?.staff?.designation,
    pay_month: route?.params?.item?.period_month,
    basic: route?.params?.item?.basic,
    hra: route?.params?.item?.breakdown?.earnings?.hra ?? 0,
    allowances: route?.params?.item?.breakdown?.earnings?.allowances ?? 0,
    deductions: route?.params?.item?.breakdown?.deductions?.ded ?? 0,
  };
  const earnings = route?.params?.item?.breakdown?.earnings;
  const deductions = route?.params?.item?.breakdown?.deductions;
  const netPay = route?.params?.item?.net_pay;
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
    navigation.navigate('PaySlips');
    return true;
  };

  let earningsHTML = '';
  for (const item of earnings) {
    earningsHTML += `<div class="row"><span>${item?.label}</span><span>₹ ${item?.amount}</span></div>`;
  }

  let deductionsHTML = '';
  for (const item of deductions) {
    deductionsHTML += `<div class="row"><span>${item?.label}</span><span>- ₹ ${item?.amount}</span></div>`;
  }

  const generatePDFs = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; color: #6C63FF; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .netpay { background: #6C63FF; color: #fff; padding: 10px; border-radius: 8px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Pay Slip</h1>
          <div class="section">
            <p><span class="label">Name:</span> ${payslip.employee_name}</p>
            <p><span class="label">Employee ID:</span> ${payslip.employee_id}</p>
            <p><span class="label">Department:</span> ${payslip.department}</p>
            <p><span class="label">Designation:</span> ${payslip.designation}</p>
            <p><span class="label">Month:</span> ${payslip.pay_month}</p>
          </div>
          <div class="section">
            <h3>Earnings</h3>
            <div class="row"><span>Basic</span><span>₹ ${payslip.basic}</span></div>
            <div class="row"><span>HRA</span><span>₹ ${payslip.hra}</span></div>
          <div class="section">
          <h3>Earnings</h3>
          ${earningsHTML}
          </div>
          <div class="section">
          <h3>Deductions</h3>
          ${deductionsHTML}
          </div>
          </div>
          <div class="netpay">
            <h2>Net Pay: ₹ ${netPay}</h2>
          </div>
          <div class="section">
          </div>
          <div class="section">
            <h6>This is system generated and needs no signature.</h6>
          </div>
        </body>
      </html>
    `;

    //   <div class="section">
    //   <h3>Earnings</h3>
    //   ${earningsHTML}
    //   </div>
    //   <div class="section">
    //   <h3>Deductions</h3>
    //   ${deductionsHTML}
    //   </div>
    try {
      let file = await generatePDF({
        html: htmlContent,
        fileName: `PaySlip_${payslip.employee_id}_${payslip.pay_month.replace(
          ' ',
          '_',
        )}`,
        base64: true,
        directory: 'Downloads',
      });

      Alert.alert('PDF Generated', `Saved to: ${file.filePath}`);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <Ionicons name="chevron-back" size={22} color="#FFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payslip - {payslip.pay_month}</Text>
        <View style={{width: 22}} />
        {/* placeholder for spacing */}
      </View>
      <ScrollView>
        {/* Employee Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          <Text style={styles.info}>Name: {payslip.employee_name}</Text>
          <Text style={styles.info}>ID: {payslip.employee_id}</Text>
          <Text style={styles.info}>Department: {payslip.department}</Text>
          <Text style={styles.info}>Designation: {payslip.designation}</Text>
          <Text style={styles.info}>Month: {payslip.pay_month}</Text>
        </View>

        {/* Salary Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Basic</Text>
            <Text style={styles.value}>₹ {payslip.basic}</Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.label}>HRA</Text>
            <Text style={styles.value}>₹ {payslip.hra}</Text>
          </View> */}
          {earnings != null &&
            typeof earnings == 'object' &&
            earnings?.map((item, index) => (
              <View style={styles.row} key={item + '-earnings'}>
                <Text style={styles.label}>{item?.label}</Text>
                <Text style={styles.value}>₹ {item?.amount}</Text>
              </View>
            ))}
          {deductions != null &&
            typeof deductions == 'object' &&
            deductions?.map((item, index) => (
              <View style={styles.row} key={item + '-deductions'}>
                <Text style={styles.label}>{item?.label}</Text>
                <Text style={[styles.value, {color: '#FF6B6B'}]}>
                  -₹ {item?.amount}
                </Text>
              </View>
            ))}
        </View>

        {/* Net Pay Highlight */}
        <View style={styles.netPayCard}>
          <Text style={styles.netPayLabel}>Net Pay</Text>
          <Text style={styles.netPayValue}>₹ {netPay}</Text>
        </View>

        {/* Download / Share */}
        <TouchableOpacity style={styles.downloadBtn} onPress={generatePDFs}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.downloadText}>Download PaySlip</Text>
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
    marginTop: 5,
    marginBottom: 25,
  },
  headerText: {fontSize: 18, fontWeight: '600', color: '#FFFF'},
  card: {
    backgroundColor: '#2E1E4D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3E2F6D',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BBAAFF',
    marginBottom: 10,
  },
  info: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#BBAAFF',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  value: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  netPayCard: {
    backgroundColor: '#6C63FF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  netPayLabel: {
    color: '#E0E0FF',
    fontSize: 14,
  },
  netPayValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  downloadBtn: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
