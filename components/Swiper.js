import {StyleSheet, Text, View,Image} from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';

const Slider = () => {
  const img1 = require('../assets/Banners-01.jpg');
  const img2 = require('../assets/Banners-02.jpg');
  const img3 = require('../assets/Banner-03.jpg');
  const img4 = require('../assets/Banner-04.jpeg');
  const img5 = require('../assets/Banner-05.jpg');
  
  return (
    <View style={{height: 200}} >
      <Swiper style={styles.wrapper} showsPagination={false} loop={true} autoplay={true}>
        <View style={styles.slide1}>
          <Image source={img3} style={styles.image} />
        </View>
        <View style={styles.slide2}>
          <Image source={img4} style={styles.image} />
        </View>
        <View style={styles.slide1}>
          <Image source={img3} style={styles.image} />
        </View>
        <View style={styles.slide2}>
          <Image source={img5} style={styles.image} />
        </View>
       
      </Swiper>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    height: 200,
  },
  slide2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
    height: 200,
  },
  slide3: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
    height: 200,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  }
});
