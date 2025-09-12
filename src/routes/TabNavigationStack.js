/**
 * @author Amusoftech <er.amudeep@gmail.com>
 * @description Minimal example of Tab Navigations
 */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {LogBox} from 'react-native';
import {appColors} from '../utils/appColors';
import {publicRoutes} from './publicRoutes';
import {RoutesList} from './routes';

const Tab = createBottomTabNavigator();

LogBox.ignoreLogs([`new NativeEventEmitter()`]); // Ignore log notification by message
export default function TabNavigationStack() {
  const [routes, setRoutes] = React.useState([...publicRoutes, ...RoutesList]);
  // const keyboardVisible = useKeyboard();
  const tabOptions = {
    backgroundColor: '#2F225B',
    borderTopWidth: 0,
    borderRadius: 20,
    margin: 10,
    height: 65,
    position: 'absolute',
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          activeTintColor: appColors.primary,
          inactiveTintColor: appColors.blackGrey,
          // tabBarStyle: { display: keyboardVisible ? 'none' : 'flex' }
        }}>
        {routes?.map((route, key) => {
          const {name, component, options} = route;
          return (
            <Tab.Screen
              key={key}
              name={name}
              component={component}
              options={{...options}}
            />
          );
        })}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
