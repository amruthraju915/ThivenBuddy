// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AttendanceHistory from './src/screens/AttendanceHistory';
import TaskScreen from './src/screens/TaskScreen';
import LeavesScreen from './src/screens/LeavesScreen';
import NewLeaveScreen from './src/screens/NewLeaveScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './src/navigations/BottomTabs';
import LoginScreen from './src/screens/LoginScreen';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { navigationTypeTabs } from './app.json';
import TabNavigationStack from './src/routes/TabNavigationStack';
import MainStack from './src/routes/MainStack';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <Provider store={store}>
        {navigationTypeTabs ? <TabNavigationStack /> : <MainStack />}
    </Provider>
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     {/* Bottom Tabs */}
    //     <Stack.Screen name="MainTabs" component={BottomTabs} />
        
    //     {/* Additional Screens not in tabs */}
    //     <Stack.Screen name="Leaves" component={LeavesScreen} />
    //     <Stack.Screen name="NewLeave" component={NewLeaveScreen} />
    //     <Stack.Screen name="LoginScreen" component={LoginScreen} />
        
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B0E39',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
