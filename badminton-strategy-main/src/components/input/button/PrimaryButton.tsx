import colors from '@src/constant/colors';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

interface CustomButtonProps {
  paddingTop: number;
  buttonText: string;
  onPress: () => void;
  fontColor?: string;
  color?: string;
  mode?: 'text' | 'contained' | 'outlined' | 'elevated' | 'contained-tonal';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  paddingTop,
  buttonText,
  onPress,
  color,
  fontColor,
  mode,
}) => {
  return (
    <View style={{ paddingTop }}>
      <Button
        labelStyle={{
          color: fontColor ?? 'black',
          fontWeight: 'bold',
          fontSize: 17,
        }}
        contentStyle={{ backgroundColor: color ?? colors.white }}
        style={{ borderRadius: 15 }}
        mode={mode ?? 'contained'}
        onPress={onPress}
      >
        {buttonText}
      </Button>
    </View>
  );
};

export default CustomButton;
