import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import React, { useEffect, useState, useRef } from 'react';


import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Modal,
  Portal,
  PaperProvider,
  Button,
} from 'react-native-paper';


const Cases: React.FC = () => {
 const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
 
 const navigateTo = (path: keyof MainStackParamList) => {
     navigation.navigate(path);
   };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover">

         <View style={styles.container}>
            {/* header section */}
            <View style={styles.headerMain}>
                      <View style={styles.headerLeftBlock}>
                        <TouchableOpacity style={[styles.backBt, { marginRight: 12 }]} onPress={() => navigation.goBack()}>
                          <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Cases</Text>
                      </View>
            
                      <View style={styles.headerRightBlock}>
                        <TouchableOpacity style={[styles.btHeader, { marginRight: 12 }]} onPress={() => navigateTo('AddCases')}>
                          <Text style={styles.btHeaderText}>Add Cases</Text>
                        </TouchableOpacity>
            
                        <TouchableOpacity style={styles.roundedIconBt}>
                          <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                        </TouchableOpacity>
            
                       
                      </View>
                    </View>
            {/* End Header */}
            
           <ScrollView style={styles.container}>
                               <View>
                                   <View style={styles.searchBlock}>
                                       <TextInput style={styles.searchFormInput} placeholder="Search" placeholderTextColor="#7B8994"
                                           
                                           mode="outlined"
                                           theme={{ roundness: 100, colors: { text: '#000', primary: '#000', background: '#fff' } }}
                                       />
                                       <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} ></Image>
                                   </View>
           
                                
           
                                   <Card style={styles.cardItemMain}>
                                       <View style={styles.cardContentInner}>
                                           <View style={styles.leftCardCont}>
                                               <Card style={styles.cardWithIcon}>
                                                   <Image style={styles.cardIconImg} source={require('../../assets/images/cases-icon.png')} />
                                               </Card>
           
                                               <View style={styles.leftTextCard}>
                                                   <Text style={styles.textCard}>Registration Center</Text>
                                                   <Text style={styles.textCard}>Case ID : 58822</Text>
                                                   <Text style={styles.textCard}>Case Type : Contact Asset Owner</Text>
                                                   <Text style={styles.textCard}>Description : 36487-AE-UQ-PRI_A</Text>
                                                   <Text style={[styles.textCard, { fontWeight: 'light' }]}>07 Mar 2025, 10:50:01</Text>
                                               </View>
                                           </View>
                                           <View style={styles.rightTextCard}>
                                               <Text style={styles.statusTextCard}>
                                                   <Text style={[styles.activeText, { fontWeight: 'normal' }]}>Active: </Text>
                                               </Text>
                                           </View>
                                       </View>
                                   </Card>
                                   <Card style={styles.cardItemMain}>
                                       <View style={styles.cardContentInner}>
                                           <View style={styles.leftCardCont}>
                                               <Card style={styles.cardWithIcon}>
                                                   <Image style={styles.cardIconImg} source={require('../../assets/images/cases-icon.png')} />
                                               </Card>
           
                                               <View style={styles.leftTextCard}>
                                                   <Text style={styles.textCard}>Registration Center</Text>
                                                   <Text style={styles.textCard}>Case ID : 58822</Text>
                                                   <Text style={styles.textCard}>Case Type : Contact Asset Owner</Text>
                                                   <Text style={styles.textCard}>Description : 36487-AE-UQ-PRI_A</Text>
                                                   <Text style={[styles.textCard, { fontWeight: 'light' }]}>07 Mar 2025, 10:50:01</Text>
                                               </View>
                                           </View>
                                           <View style={styles.rightTextCard}>
                                               <Text style={styles.statusTextCard}>
                                                   <Text style={[styles.inprogsText, { fontWeight: 'normal' }]}>in Progress: </Text>
                                               </Text>
                                           </View>
                                       </View>
                                   </Card>
                                   
                               </View>
           
           
           
           
                           </ScrollView >



         </View>

          
        
    </ImageBackground>

  );
};

export default Cases;

const styles = StyleSheet.create({

    //--- Header
    backgroundImage: {
        flex: 1,
 
    },
  
 title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#fff'
  },
    container: {
        // flex: 1,
        marginHorizontal: 10,
        marginTop: 20,
        paddingBottom: 40,
    },

    headerMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: 'transparent',
        marginTop: 12,
        

    },
    backBt: {},
    headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start', },
    headerRightBlock: { flexDirection: 'row', justifyContent: 'flex-end', },
    headerIcon: { width: 18, height: 18, },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },


    btHeader: {
        backgroundColor: '#ff5200', borderRadius: 100,
        textAlign: 'center', alignSelf: 'flex-start', paddingTop: 5, paddingBottom: 7,
    },
    btHeaderText: { color: '#fff', fontSize: 13, paddingHorizontal: 10, },

    roundedIconBt: {
        width: 34,
        height: 34,
        backgroundColor: '#ff5200',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        paddingHorizontal: 0,
    },
    roundedIcon: {
        width: 20,
        height: 20,
        tintColor: 'white'
    },

    searchBlock: {
        marginTop: 0,
        marginHorizontal: 5,
        marginBottom: 15,
        height: 50,

    },

    searchFormInput: {
        height: 44,
        borderColor: '#fff',
        borderRadius: 100,
        paddingRight: 20,
        paddingLeft: 25,
        marginTop: 0,
        fontSize: 15,
        fontWeight: 400,
        color: '#000',
        backgroundColor: '#fff'


    },

    formInputIcon: {
        width: 16,
        height: 16,
        position: 'absolute',
        top: 15,
        left: 14,
    },

    //--- Header End

    //---
    sectionTitle: {
        margin: 15,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'normal',
    },
    cardItemMain: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 0,
        marginHorizontal: 5,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },
    cardContentInner: {
        marginTop: 0,
        borderRadius: 50,
        paddingVertical: 10,
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between',



    },

    cardWithIcon: {
        width: 54,
        height: 54,
        backgroundColor: '#C03F00',
        borderRadius: 100,
        borderWidth: 8,
        borderColor: '#2C2C2C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0,
        elevation: 0,
        shadowColor: 'transparent',
        marginRight: 10,
        padding: 0,
    },

    cardIconImg: {
        width: 22,
        height: 22,
        tintColor: 'white'
    },
    leftTextCard: {
        // paddingRight: 10,
    },

    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '71%',
    },

    textCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
    },

    deateCard: {
        fontSize: 11,
        color: '#fff',
        paddingTop: 6,

    },
    rightTextCard: {

        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    largeTextRCard: {
        color: '#fff',
        fontSize: 16,

    },
    statusTextCard: {
        fontSize: 12,
        backgroundColor: '#000000',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 30,
        color: '#06F547',
        marginTop: 0,
    },
    activeText: {
        color: '#06F547',
    },
    inprogsText: {
        color: '#007AFF',
    },

    


});