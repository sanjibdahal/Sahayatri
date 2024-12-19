import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { Link } from 'expo-router'

import "@/global.css"

const Profile = () => {
  return (
    <SafeAreaView style={{backgroundColor: 'purple', flex: 1}}>
      <View className='bg-red-500'>
        <Text className='text-4xl font-plusjakartasans_700bold color-purple-500'>Profile</Text>
        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  )
}

export default Profile;

