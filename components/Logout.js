import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from './Colors';



const Logout = () => {
  return (
    <>
      <Icon name="logout-variant" color={color.primary} size={30} />
    </>
  )
}

export default Logout

const styles = StyleSheet.create({})