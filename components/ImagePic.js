import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from "react-native-view-shot";



const ImagePic = () => {

    const [image, setImage] = React.useState(null);
    const [ext, setExt] = React.useState(null);
    const ImageHandle = () => {
        const options = {
          title: 'Select Avatar',    
          storageOptions: {
            skipBackup: true,
            path: 'images',  
          },
          mediaType: 'photo',
          includeBase64: true
          
        };
        launchImageLibrary(options, response => {
          // Same code as in above section!
            // const {base64} = response.assets;
            //  console.log(base64);
            if (response.didCancel) {
              console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ');
                }
                else if (response.customButton) {
                    console.log('User tapped custom button: ');
                    }
                    else {
                        const {type} = response.assets[0];
                        const typeSplit = type.split('/');
                        const {base64} = response.assets[0];
                        setImage(base64);
                        setExt(typeSplit[1]);
                        }
        });
      };

      const handleclick = async () => {

        await AsyncStorage.getItem('@studentId').then(value => {
            const Id = JSON.parse(value);
             axios.post(`${BASE_URL}/Student/AddImage`,{
                id:Id,
                image: image,
                ext: ext
          }).then((res)=>{
                console.log(res);
          }).catch((err)=>{
              console.log(err);
          })
           
        });

     
       

      }
    
  return (
    <View>
      <Text>AdminCard</Text>
      <Button 
      onPress={ImageHandle}
      >Image picker</Button>

      <Button onPress={handleclick} >Hit</Button>
    </View>
  )
}

export default ImagePic

const styles = StyleSheet.create({})