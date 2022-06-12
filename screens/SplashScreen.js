import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { color } from '../components/Colors'



const SplashSCreen = () => {
  return (
    <View style={styles.splash}>
      <Image
        source={require('../assets/Bano-Qabil-Logo-Green.png')}
        style={styles.logo}
      />
    </View>
  )
}

export default SplashSCreen

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        backgroundColor: color.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
})