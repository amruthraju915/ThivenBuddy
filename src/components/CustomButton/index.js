import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { scale } from 'react-native-size-matters';
import TouchableRipple from 'react-native-touch-ripple';
import { appColors } from '../../utils/appColors';

export default function index({
  icon,
  unFilled,
  label,
  style,
  onPress,
  labelStyle,
  isLoading,
  disabled,
  iconType,
  iconSize,
  ricon
}) {
  return (
    <TouchableRipple
      rippleColor={appColors.white}
      onPress={onPress}
      rippleDuration={800}
      disabled={disabled}
      style={[styles.container, unFilled ? styles.unFilled : {}, style,disabled ? {backgroundColor:appColors.primary} :{}, ricon ? {paddingHorizontal:scale(2)} :{}]}>
      {icon && (
        <Icon
          type={iconType}
          name={icon}
          size={iconSize?iconSize:scale(20)}
          color={unFilled ? appColors.black : appColors.white}
        />
      )}
     {!isLoading? <Text
        style={[
          styles.label,
          unFilled ? styles.unFilledLabel : {},
          labelStyle,
        ]}>
        {`${label}`}
      </Text> : 
      <ActivityIndicator size={"large"} color={appColors.lwhite} />
      }

    {ricon && (
        <Icon
          type={iconType}
          name={ricon}
          size={iconSize?iconSize:scale(20)}
          color={unFilled ? appColors.black : appColors.white}
        />
      )}
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    height: scale(50),
    backgroundColor: appColors.primary,
    borderRadius: scale(10),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: scale(10),
    paddingHorizontal: scale(10),
  },
  label: {
    fontSize: scale(16),
    fontWeight: '500',
    color: appColors.background,
    letterSpacing: scale(2),
  },
  unFilled: {
    backgroundColor: 'transparent',
    borderWidth: scale(0.7),
    borderColor: appColors.primary,
  },
  unFilledLabel: {
    color: appColors.black,
  },
});
