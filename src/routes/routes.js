/**
 * @author Amusoftech <er.amudeep@gmail.com>
 * @description List of routes for Tabs Navigator and Stack navigator, Along addational  Option for Tabs
 */
import {Dimensions, View} from 'react-native';
import {Icon} from 'react-native-elements';
import Label from '../components/Label';
import {
  alignCenter,
  f12,
  f14,
  greyColor,
  headerStyle,
  justifyContent,
  mt20,
  primaryColor,
  whiteColor,
} from '../styles/styles';
import {appColors} from '../utils/appColors';
import HomeScreen from '../screens/HomeScreen';
import AttendanceHistory from '../screens/AttendanceHistory';
import TaskScreen from '../screens/TaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewLeaveScreen from '../screens/NewLeaveScreen';
import LeavesScreen from '../screens/LeavesScreen';
import PayslipScreen from '../screens/PayslipScreen';
import TimesheetScreen from '../screens/TimesheetScreen';
import AddTimesheetScreen from '../screens/AddTimeSheet';

const {width} = Dimensions.get('screen');

const noTabBarItemStyle = {
  tabBarButton: props => null,
  tabBarVisible: false,
  tabBarBadge: 3,
  tabBarLabel: '',
  headerShown: false,
  tabBarItemStyle: {display: 'none'},
  tabBarStyle: {display: 'none'},
};
const tabOptions = {
  backgroundColor: '#2F225B',
  borderTopWidth: 0,
  borderRadius: 20,
  margin: 10,
  height: 65,
  position: 'absolute',
};
const tabLagel = {
  width: width / 4,
};

export const RoutesList = [
  {
    name: 'Home',
    component: HomeScreen,
    options: {
      tabBarIcon: props => (
        <View style={[alignCenter, justifyContent, mt20, tabLagel]}>
          <Icon
            name={props.focused ? 'home' : 'home'}
            color={props.focused ? appColors.white : appColors.grey}
            style={{width: 24, height: 24}}
            type="ionicon"
          />
          <Label
            text={'Home'}
            style={[headerStyle, f14, props.focused ? whiteColor : greyColor]}
          />
        </View>
      ),
      tabBarLabel: '',
      headerTitleAlign: 'center',
      headerShown: false,
      tabBarStyle: tabOptions,
    },
  },
  {
    name: 'Attendance',
    component: AttendanceHistory,
    options: {
      tabBarIcon: props => (
        <View style={[alignCenter, justifyContent, mt20, tabLagel]}>
          <Icon
            name={props.focused ? 'calendar' : 'calendar'}
            color={props.focused ? appColors.white : appColors.grey}
            style={{width: 24, height: 24}}
            type="ionicon"
          />
          <Label
            text={'Attendance'}
            style={[headerStyle, f14, props.focused ? whiteColor : greyColor]}
          />
        </View>
      ),
      tabBarLabel: '',
      headerTitleAlign: 'center',
      headerShown: false,
      tabBarStyle: tabOptions,
    },
  },
  {
    name: 'TimeSheets',
    component: TimesheetScreen,
    options: {
      tabBarIcon: props => (
        <View style={[alignCenter, justifyContent, mt20, tabLagel]}>
          <Icon
            name={props.focused ? 'list' : 'list'}
            color={props.focused ? appColors.white : appColors.grey}
            style={{width: 28, height: 28}}
            type="ionicon"
          />
          <Label
            text={'Time Sheets'}
            style={[headerStyle, f12, props.focused ? whiteColor : greyColor]}
          />
        </View>
      ),
      tabBarLabel: '',
      headerTitleAlign: 'center',
      headerShown: false,
      tabBarStyle: tabOptions,
    },
  },
  {
    name: 'PaySlips',
    component: PayslipScreen,
    options: noTabBarItemStyle,
  },
  {
    name: 'AddTimesheet',
    component: AddTimesheetScreen,
    options: noTabBarItemStyle,
  },
  {
    name: 'Tasks',
    component: TaskScreen,
    options: noTabBarItemStyle,
    // options: {
    //   tabBarIcon: props => (
    //     <View style={[alignCenter, justifyContent, mt20, tabLagel]}>
    //       <Icon
    //         name={props.focused ? 'list' : 'list'}
    //         color={props.focused ? appColors.white : appColors.grey}
    //         style={{width: 28, height: 28}}
    //         type="ionicon"
    //       />
    //       <Label
    //         text={'Tasks'}
    //         style={[headerStyle, f12, props.focused ? whiteColor : greyColor]}
    //       />
    //     </View>
    //   ),
    //   tabBarLabel: '',
    //   headerTitleAlign: 'center',
    //   headerShown: false,
    // },
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    options: {
      tabBarIcon: props => (
        <View style={[alignCenter, justifyContent, mt20, tabLagel]}>
          <Icon
            name={props.focused ? 'file-tray-full' : 'file-tray-full-outline'}
            color={props.focused ? appColors.white : appColors.grey}
            style={{width: 24, height: 24}}
            type="ionicon"
          />
          <Label
            text={'Profile'}
            style={[headerStyle, f14, props.focused ? whiteColor : greyColor]}
          />
        </View>
      ),
      tabBarLabel: '',
      headerTitleAlign: 'center',
      headerShown: false,
      tabBarStyle: tabOptions,
    },
  },
  {
    name: 'Leaves',
    component: LeavesScreen,
    options: noTabBarItemStyle,
  },
  {
    name: 'NewLeave',
    component: NewLeaveScreen,
    options: noTabBarItemStyle,
  },
  // {
  //   name: 'PaymentScreen',
  //   component: PaymentScreen,
  //   options: {
  //     tabBarButton: (props) => null,
  //     tabBarVisible: false,
  //     tabBarLabel: '',
  //     headerTitleAlign: 'center',
  //     headerTitle: "Order Summary",
  //     tabBarStyle: { display: "none" }
  //   }
  // }
];
