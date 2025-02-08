import React, { useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Select Date' }: DatePickerProps) {
  const [show, setShow] = useState(false);
  const colorScheme = useColorScheme();
  const currentDate = value ? new Date(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate.toISOString());
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={showDatepicker}
        style={[
          styles.button,
          { borderColor: Colors[colorScheme].tint }
        ]}>
        <ThemedText>
          {value ? new Date(value).toLocaleDateString() : placeholder}
        </ThemedText>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
}); 