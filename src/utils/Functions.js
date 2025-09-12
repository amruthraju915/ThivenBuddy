import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {APP_URL} from './ApiList';
import RequestMake from './RequestMake';
import {
  PERMISSIONS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

const errorMessage = {
  success: 0,
  message: 'Network Issue. Try after sometime',
};

export async function getStorageItem(val) {
  let value;
  try {
    value = await AsyncStorage.getItem(val);
    if (value) value = JSON.parse(value);
  } catch (error) {}
  return value;
}
export async function setStorageItem(key, val) {
  try {
    await AsyncStorage.setItem(key, val);
  } catch (error) {}
}
// Clearing all previously saved values
export async function clearStorage() {
  try {
    await AsyncStorage.clear();
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    // There was an error on the native side
  }
}

export async function getProfile(token) {
  // user/profile
  let URL = APP_URL + 'profile';
  let val;
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await RequestMake(URL, requestOptions);
    if (result?.success == 1) {
      if (result?.data?.data?.length > 0) val = result?.data?.data[0];
    }
  } catch (error) {
    //  console.log(error);
  }
  return val;
}
// leave-types
export async function getLeaveTypes(token) {
  // daily-timesheets
  let URL = APP_URL + `leave-types`;
  let val = [];
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await RequestMake(URL, requestOptions);
    if (result?.success == 1) {
      if (result?.data?.length > 0) val = result?.data;
    }
  } catch (error) {
    //  console.log(error);
  }
  return val;
}
export async function getPayslips(token, page) {
  // daily-timesheets
  let URL = APP_URL + `pay_slips?page=${page}`;
  let val = [];
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await RequestMake(URL, requestOptions);
    if (result?.success == 1) {
      if (result?.data?.data?.length > 0) val = result?.data?.data;
    }
  } catch (error) {
    //  console.log(error);
  }
  return val;
}
export async function getLeaves(token, leave_type_id, page) {
  // daily-timesheets
  let URL = APP_URL + `leaves?page=${page}`;
  if(leave_type_id) URL += '&leave_type_id='+leave_type_id;
  let val = [];
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await RequestMake(URL, requestOptions);
    if (result?.success == 1) {
      if (result?.data?.data?.length > 0) val = result?.data?.data;
    }
  } catch (error) {
    //  console.log(error);
  }
  return val;
}
export async function getWorkSession(token, range, page) {
  // daily-timesheets
  let URL = APP_URL + `work-session?range=${range}&page=${page}`;
  let val = [];
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await RequestMake(URL, requestOptions);
    if (result?.success == 1) {
      if (result?.data?.length > 0) val = result;
    }
  } catch (error) {
    //  console.log(error);
  }
  return val;
}

export async function getTimeSheets(token, range, page) {
  // daily-timesheets
  let URL = APP_URL + `daily-timesheets?range=${range}&page=${page}`;
  let val = [];
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await RequestMake(URL, requestOptions);
    if (result?.success == 1) {
      if (result?.data?.length > 0) val = result?.data;
    }
  } catch (error) {
    //  console.log(error);
  }
  return val;
}
//leave/apply
export async function submitLeave(token, data) {
  // daily-timesheets
  let URL = APP_URL + `leave/apply`;
  let val = null;
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    };
    const result = await RequestMake(URL, requestOptions);
    return result;
  } catch (error) {
    val = errorMessage;
    //  console.log(error);
  }
  return val;
}

export async function submitTimeSheets(token, data) {
  // daily-timesheets
  let URL = APP_URL + `timesheet/submit`;
  let val = null;
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    };
    const result = await RequestMake(URL, requestOptions);
    return result;
  } catch (error) {
    val = errorMessage;
    //  console.log(error);
  }
  return val;
}

export const onNotificationListener = async () => {
  try {
    let removeOnNotification = await messaging().onMessage(
      onMessageReceived => {
        let data = onMessageReceived.data;
        notifee.displayNotification({
          title: data.title,
          body: data.body,
          android: {
            channelId: 'app_atp_com',
          },
          ios: {
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
          },
        });
      },
    );
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  // displayNotification("onMessageReceived");
};
export async function requestPermissions() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('Permission granted');
  } else {
    console.log('Permission denied');
  }

  await notifee.createChannel({
    id: 'com_thiven_buddy',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  onNotificationListener();
}
