import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale } from 'react-native-size-matters';
import { brcg, brcp, brw1 } from '../../styles/styles';
import { MAP_API_KEY } from '../../utils/ApiList';
import { appColors } from '../../utils/appColors';
import Label from '../Label';

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  InputStyle,
  IconRight,
  IconLeft,
  label,
  labelStyle,
  containerStyle,
  isSelectable,
  arrayData,
  inputType,
  editable,
  reference,
  autoFocus,
  multiline,
  numberOfLines,
  singleName,
  trends
}) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();
  // const [displayedText, setDisplayedText] = useState(placeholder);
  const pickerRef = useRef();


  const openPicker = () => {
    if (inputType == 'dob' || inputType == 'date') setOpen(true);
    return;
    pickerRef.current.focus();
  }
  function closePicker() {
    pickerRef.current.blur();
  }
  const onFocus = () => {
    setFocused(!focused);
  };
  const toCapital = (data) => {
    // if (data) {
    //   data = data.replace("_", " ");
    //   data = data.replace("_", " ");
    //   data = data.replace("_", " ");
    //   data = data.replace("_", " ");
    //   if (data) data = data.toLowerCase();
    //   data = data.charAt(0).toUpperCase() + data.slice(1);
    //   if (data.slice(1) == "bhk") {
    //     data = data.toUpperCase();
    //   }
    // }
    return data;
  }
  return (
    <View style={styles.Mcontainer}>
      {label && (
        <View style={{ paddingVertical: scale(0), paddingHorizontal: scale(10) }}>
          <Label adjustsFontSizeToFit={true} numberOfLines={1} style={[{ color: appColors.blackGrey, fontSize: 14, textTransform: "capitalize" }, labelStyle ? labelStyle : {}]} text={label} />
        </View>
      )}
      <View
        style={[
          styles.container, containerStyle,
          focused ? styles.activeBorder : styles.blurBorder, { overflow: "hidden" }
        ]}>
        {open && <>{inputType == 'dob' ?
          <DatePicker
            modal
            // locale={"en"}
            open={open}
            date={value ? new Date(value) : new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            maximumDate={new Date()}
            dateFormat="DD-MM-YYYY"
            mode={"date"}
            theme={"dark"}
            color={"#000000"}
            onConfirm={(date) => {
              setOpen(false);
              let v = inputType == 'dob' ? moment(date).format("yyyy-MM-DD") : inputType == 'date' ? moment(date).format("yyyy-MM-DD") : new Date(date).toISOString();
              onChangeText(v)
            }}
            onCancel={() => {
              setOpen(false)
            }}
          /> :
          <DatePicker
            modal
            // locale={"en"} 
            open={open}
            minimumDate={new Date()}
            date={value ? new Date(value) : new Date()}
            dateFormat="DD-MM-YYYY"
            mode={inputType}
            theme={"dark"}
            color={"#000000"}
            onConfirm={(date) => {
              setOpen(false)
              let v = inputType == 'dob' ? moment(date).format("yyyy-MM-DD") : inputType == 'date' ? moment(date).format("yyyy-MM-DD") : new Date(date).toISOString();
              onChangeText(v)
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />}
        </>}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {IconLeft && <IconLeft />}
          {inputType == "location" ?
            <GooglePlacesAutocomplete
              placeholder={placeholder}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              query={{
                key: MAP_API_KEY,
                language: 'en',
              }}
              minLength={2}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              styles={{
                textInputContainer: {
                  backgroundColor: 'grey',
                },
                textInput: {
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
            />
            : inputType == "modal" ?
              <View style={[styles.custumInput, { width: "85%" }]}>
                <Text style={{ color: value ? appColors.black : appColors.placeholder, fontSize: 14 }}>{value ?? placeholder}</Text>
              </View>
              :
              inputType == "date" ?
                <TouchableOpacity onPress={() => setOpen(true)} style={styles.custumInput}>
                  <Text style={{ color: value ? appColors.black : appColors.placeholder, fontSize: 16 }}>{value ? moment(value).format("DD MMM yyyy") : placeholder}</Text>
                </TouchableOpacity>
                :
                inputType == "dob" ?
                  <TouchableOpacity onPress={() => setOpen(true)} style={styles.custumInput}>
                    <Text style={{ color: value ? appColors.black : appColors.placeholder, fontSize: 16 }}>{value ? moment(value).format("DD MMM yyyy") : placeholder}</Text>
                  </TouchableOpacity>
                  :
                  inputType == "datetime" ?
                    <TouchableOpacity onPress={() => setOpen(true)} style={styles.custumInput}>
                      <Text style={{ color: value ? appColors.black : appColors.placeholder, fontSize: 16 }}>{value ? moment(value).format("DD MMM yyyy hh:mm a") : placeholder}</Text>
                    </TouchableOpacity>
                    :
                    isSelectable ?
                      <Picker
                        ref={pickerRef}
                        mode={"dropdown"}
                        placeholder={placeholder}
                        selectedValue={value}
                        dropdownIconColor={appColors.primary}
                        dropdownIconRippleColor={appColors.primary}
                        style={[InputStyle, {
                          color: appColors.placeholder, width: "100%"
                        }]}
                        onValueChange={onChangeText}>
                        <Picker.Item key={"Rolesw-" + 1} style={[styles.pickerItem, InputStyle]} color={colorScheme === 'dark' ? appColors.white : appColors.black} label={placeholder ?? label} value={""} />
                        {arrayData.map((data) => (
                          <Picker.Item key={"Roles-" + data.id} style={[styles.pickerItem, InputStyle]} color={colorScheme === 'dark' ? appColors.white : appColors.black} label={singleName ? toCapital(data) : toCapital(data.name)} value={singleName ? String(data) : String(data.id)} />
                        ))}
                      </Picker>
                      :
                      <TextInput
                        multiline={multiline ? multiline : false}
                        numberOfLines={numberOfLines}
                        placeholder={placeholder}
                        placeholderTextColor={appColors.placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        editable={editable ? false : true}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        style={[styles.input, InputStyle]}
                        onBlur={onFocus}
                        onFocus={onFocus}
                        ref={reference ? reference : null}
                        autoFocus={autoFocus ? true : false}
                      />
          }
          {(IconRight && !isSelectable) && <>{(inputType == 'dob' || inputType == 'date') ? <TouchableOpacity onPress={openPicker}><IconRight /></TouchableOpacity> : <IconRight />}</>}
          {/* <>{isSelectable ? <TouchableOpacity onPress={openPicker}><IconRight onPress={openPicker}/></TouchableOpacity> : <IconRight onPress={openPicker}/>}</> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Mcontainer: {
    paddingHorizontal: scale(0),
    backgroundColor: appColors.white,
  },
  container: {
    // flexDirection: "row",
    paddingHorizontal: scale(5),
    //margin: scale(5),
    //height: scale(45),
    // alignItems: "center",
    // shadowColor: appColors.background,
    // backgroundColor: appColors.white,
    // borderWidth: scale(0.4),
    // ...shadow
    ...brw1, ...brcg
  },
  input: {
    color: appColors.black,
    paddingVertical: scale(10),
    flex: 1,
    fontSize: scale(14),
  },
  blurBorder: {
    ...brcg
  },
  activeBorder: {
    ...brcp,
  },
  custumInput: {
    paddingHorizontal: 5, width: "90%", paddingVertical: 14
  },
  custumValue: {

  },
  pickerItem: {
    backgroundColor: appColors.background, color: appColors.blackGrey, textTransform: "capitalize"
  }
});
