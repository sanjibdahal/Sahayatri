import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { Link } from 'expo-router'


const Profile = () => {
  return (
    <SafeAreaView style={{backgroundColor: 'purple', flex: 1}}>
      <View className=''>
        <Text className='text-4xl font-plusjakartasans_700bold'>Profile</Text>
        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  )
}

export default Profile;

