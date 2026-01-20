import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image, Linking } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, PaperProvider, Button, IconButton  } from 'react-native-paper';
import { Animated} from 'react-native';
import { MainStackParamList } from '../../App';
import dayjs from 'dayjs';
import { useAccount } from '../context/AccountProvider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



type ViolationsDetailsProp = RouteProp<MainStackParamList, 'ViolationsDetails'>

const ViolationsDetails: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<ViolationsDetailsProp>();
    const violationDetails = route.params.state;
    const handlePress = () => {
        Linking.openURL('https://aber.rak.ae/');
    };
    const { full, loadingFull } = useAccount();
    

    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={styles.backBt} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{violationDetails.TransactionId}</Text>
                    </View>

                    <View style={styles.headerRightBlock}>
                        <Text style={styles.btHeaderText}>{dayjs(violationDetails.TransactionDate).format('DD MMM YYYY')}</Text>
                    </View>
                </View>
               
                <View style={styles.containerInner}>
                    <Text style={styles.smallText}>Dear Sir</Text>
                    <Text style={styles.BoldText}>{full.AccountName}</Text>
                    <Text style={styles.smallText}>Please note that your current Account Balance is below the Low Balance Threshold of AED and if the situtation persists your account can be subject to Suspension.</Text>
                    <Text style={styles.BoldText}>{(violationDetails.AmountFinal)} AED</Text>
                    <Text style={[styles.smallText, { textDecorationLine: 'underline' }]}>Your current account Balance :</Text>
                    <Text style={styles.BoldText}>{new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(full.Balance)} AED</Text>
                    <Text style={styles.smallText}>Please perform a payment as soon as possible to replenish your account balance. For further information please visit our web site</Text>
               
               
                    <Card style={[styles.cardItemMain, {  }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/glob-icon.png')} />
                            <Text style={{ fontSize: 14, color: '#FF5400', marginLeft: 8, textDecorationLine: 'underline' }}>
                                self-care web portal
                            </Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#fff', marginLeft: 8, paddingVertical:10}}>
                            self-care web portal
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/mobile-icon.png')} />
                            <Text style={{ fontSize: 14, color: '#FF5400', marginLeft: 8, }}>
                                800-9898
                            </Text>
                        </View>
                    </Card>
                    <Card style={[styles.cardItemMain, {  }]}>
                       
                       <Text style={styles.smallText1}>Yours sincerely, ABER Customer Service Public Services Department Government of Ras AI Khaimah</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/mobile-icon.png')} />
                            <TouchableOpacity onPress={handlePress}>
                                <Text style={styles.linkText}>https://aber.rak.ae/</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
               </View>

               
                
            </View>
            </SafeAreaView>
        </ImageBackground>

    );
};
export default ViolationsDetails;

const styles = StyleSheet.create({
   //--- Header
backBt:{
    marginRight:12
},
   
linkText: {
    fontSize: 14,
    color: '#FF5400',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  image: {
    width: 40,
    height: 40,
  },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 10,

    },
     containerInner: {
        marginHorizontal: 18,
        marginTop: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.6)',
        // borderRadius: 20,
        // paddingHorizontal: 15,
        // paddingVertical: 15,
    },
     headerMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: 'transparent',
       
    },
   
    
    headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start', },
    headerRightBlock: {  justifyContent: 'flex-end', },
    headerIcon: { width: 18, height: 18, },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },


    btHeader: {
        backgroundColor: '#ff5200', borderRadius: 100,
        textAlign: 'center', alignSelf: 'flex-start', paddingTop: 5, paddingBottom: 7,
    },
    btHeaderText: { color: '#fff', fontSize: 13, paddingHorizontal: 2, },
    smallText: { color: '#fff', fontSize: 13, paddingHorizontal: 2, marginTop:15, lineHeight:18, textAlign:'justify' },
    smallText1: { color: '#fff', fontSize: 13, paddingHorizontal: 2, marginTop:5, lineHeight:18, textAlign:'center' },
    BoldText: { color: '#fff', fontSize: 14, paddingHorizontal: 2, fontWeight: 'bold', marginTop:15 },

    cardItemMain: {
        padding:15,
        marginTop: 20,
        marginHorizontal: 5,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
        alignItems: 'center', 
        textAlign:'center'
          },
   
});