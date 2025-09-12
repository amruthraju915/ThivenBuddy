import React from 'react';
import { StyleSheet, View } from 'react-native';
import Label from './Label';
import { appColors } from '../utils/appColors';

export default function NoData() {
  return (
    <View style={styles.container}>
        <Label style={{textAlign:"center",fontSize:18,color:appColors.primary}} text={"No data found"}/>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,justifyContent:"center",alignItems:"center"
    }
})