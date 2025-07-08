import React from 'react';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';
import { KeyboardTypeOptions } from 'react-native';
import colors from '@src/constant/colors';

interface CustomTextInputProps {
  id: string;
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  color?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  maxLength?: number;
  height?: number;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  id,
  text,
  setText,
  placeholder,
  error,
  secureTextEntry,
  color,
  keyboardType,
  multiline,
  maxLength,
  height,
}) => {
  return (
    <>
      <PaperTextInput
        mode="outlined"
        label=""
        id={id}
        maxLength={maxLength ?? undefined}
        autoCapitalize="none"
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        multiline={multiline ?? false}
        keyboardType={keyboardType ?? 'default'}
        theme={{
          colors: {
            primary: error ? colors.error : colors.primary,
            onSurfaceVariant: color ?? colors.white,
          },
        }}
        style={
          height
            ? {
                backgroundColor: 'transparent',
                width: '100%',
                marginVertical: 5,
                height: height,
              }
            : {
                backgroundColor: 'transparent',
                width: '100%',
                marginVertical: 5,
              }
        }
        contentStyle={{ color: color ?? colors.white }}
        outlineStyle={{
          borderColor: error ? colors.error : color ?? colors.white,
          borderRadius: 10,
        }}
        secureTextEntry={secureTextEntry ?? false}
      />
      <Text style={{ color: colors.error, fontSize: 12, marginHorizontal: 10 }}>
        {error ?? ''}
      </Text>
    </>
  );
};

export default CustomTextInput;
