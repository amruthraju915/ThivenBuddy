import LeavesScreen from '../screens/LeavesScreen';
import LoginScreen from '../screens/LoginScreen';
import NewLeaveScreen from '../screens/NewLeaveScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
// import Welcome from '../screens/Welcome/Welcome';

const options = {
  tabBarButton: props => null,
  tabBarVisible: false,
  tabBarBadge: 0,
  tabBarLabel: '',
  headerShown: false,
  tabBarStyle: {display: 'none'},
  tabBarItemStyle: {display: 'none'},
};
export const publicRoutes = [
  // {
  //   name: 'Splash',
  //   component: Splash,
  //   options: {
  //     tabBarButton: (props) => null,
  //     tabBarVisible: false,
  //     tabBarBadge: 3,
  //     tabBarLabel: 'Splash',
  //     headerShown: false,
  //     tabBarStyle:{display:"none"}
  //   },
  // },
  {
    name: 'Welcome',
    component: WelcomeScreen,
    options: options,
  },
  {
    name: 'SignIn',
    component: LoginScreen,
    options: options,
  },
  // {
  //   name: 'SuccessPage',
  //   component: SuccessPage,
  //   options: {
  //     tabBarButton: (props) => null,
  //     tabBarVisible: false,
  //     tabBarBadge: 3,
  //     tabBarLabel: 'Success Page',
  //     headerShown: false,
  //     tabBarStyle:{display:"none"}
  //   },
  // },
];
