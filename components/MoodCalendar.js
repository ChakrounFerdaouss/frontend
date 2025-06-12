import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function MoodCalendar({ markedDates, onDayPress }) {
  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          todayTextColor: '#6C63FF',
          arrowColor: '#6C63FF',
          dotColor: '#6C63FF',
          selectedDayBackgroundColor: '#6C63FF',
          selectedDayTextColor: '#fff',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
