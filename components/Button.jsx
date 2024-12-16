import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

// interface 

const Button = ({onPress, title}) => {
  return (
    <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{backgroundColor: "#1A1A1A"}}
    >
      <Text style={{color: "#FFFFFF"}}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button