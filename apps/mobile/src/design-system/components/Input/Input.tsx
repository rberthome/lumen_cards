import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { colors, spacing, typography } from '@/design-system/tokens';

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  keyboardType?: TextInputProps['keyboardType'];
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          error ? styles.inputRowError : styles.inputRowDefault,
          disabled && styles.inputRowDisabled,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.eyeBtn}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '●' : '○'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing[1] },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing[3],
  },
  inputRowDefault: { borderColor: colors.neutral[300] },
  inputRowError: { borderColor: colors.semantic.error },
  inputRowDisabled: { backgroundColor: colors.neutral[50], opacity: 0.5 },
  input: {
    flex: 1,
    paddingVertical: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.neutral[900],
  },
  eyeBtn: { paddingLeft: spacing[2] },
  eyeIcon: { fontSize: 16, color: colors.neutral[500] },
  error: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
  },
});
