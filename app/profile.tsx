import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
// import { Link } from 'expo-router'

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text className='text-4xl font-bold'>Profile</Text>
      <StatusBar style='auto' />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#ff0',
    justifyContent: 'center',
    alignItems: 'center',
  },
})