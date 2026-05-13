import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface InputProps {
  label?: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  style?: ViewStyle;
}

export function Input({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
}: InputProps) {
  const { tokens } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: tokens.spacing.md,
  };

  const labelStyle: TextStyle = {
    fontSize: tokens.typography.bodySmall.fontSize,
    fontWeight: tokens.typography.bodySmall.fontWeight,
    lineHeight: tokens.typography.bodySmall.lineHeight,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  };

  const inputStyle: ViewStyle & TextStyle = {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.md,
    borderWidth: 1,
    borderColor: error
      ? tokens.colors.error
      : isFocused
        ? tokens.colors.primary
        : tokens.colors.border,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    fontSize: tokens.typography.body.fontSize,
    fontWeight: tokens.typography.body.fontWeight,
    lineHeight: tokens.typography.body.lineHeight,
    color: tokens.colors.text,
  };

  const errorStyle: TextStyle = {
    fontSize: tokens.typography.caption.fontSize,
    fontWeight: tokens.typography.caption.fontWeight,
    lineHeight: tokens.typography.caption.lineHeight,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  };

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyle}
        accessibilityLabel={label}
      />
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
}
