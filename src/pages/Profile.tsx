import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, TextInput, Modal, Portal, PaperProvider, Button, Avatar } from 'react-native-paper';


const Profile: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 100 };
    const navigation = useNavigation();
    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <PaperProvider>


                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={[styles.backBt, { marginRight: 12, }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>
                </View>


                <ScrollView style={styles.container}>
                    <View style={styles.innerContainerPad}>

                        <Avatar.Icon size={72} style={styles.avatarIcon} icon="account" />
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { fontSize: 15, fontWeight: 500, }]}>Mansour mohammed Saeed Alassar</Text>
                            <Text style={[styles.userName, { fontSize: 13, fontWeight: 400, }]}> mohammed@alarabigroupuae.com</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Accounts</Text>

                        <TouchableOpacity style={styles.cardItemMain}>
                            <View style={styles.cardContentInner}>
                                <View style={styles.leftCardCont}>
                                    <Card style={styles.cardWithIcon}>
                                        <Image style={styles.cardIconImg} source={require('../../assets/images/address-icon.png')} />
                                    </Card>

                                    <View style={styles.leftTextCard}>
                                        <Text style={styles.textCard}>AL ARABI GLOBAL LOGISTICS SERVICES</Text>
                                        <Text style={styles.smallLabel}>Customer ID</Text>
                                        <Text style={styles.smallTextCard}>123456789</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.activeCardItemMain }>
                            <View style={styles.cardContentInner}>
                                <View style={styles.leftCardCont}>
                                    <Card style={styles.cardWithIcon}>
                                        <Image style={styles.cardIconImg} source={require('../../assets/images/address-icon.png')} />
                                    </Card>

                                    <View style={styles.leftTextCard}>
                                        <Text style={styles.textCard}>AL ARABI GLOBAL LOGISTICS SERVICES </Text>
                                        <Text style={styles.smallLabel}>Customer ID</Text>
                                        <Text style={styles.smallTextCard}>123456789</Text>
                                    </View>                   
                                </View>
                                 <Image style={styles.tickmarkPosition} source={require('../../assets/images/tickmark.png')} />
                            </View>
                        </TouchableOpacity>

                          <Text style={[styles.sectionTitle, {borderBottomColor:'#ccc', borderBottomWidth:1, paddingBottom:8,}]}>Settings</Text>

<Button icon="camera" onPress={() => console.log('Pressed')}>
   Change Password
  </Button>

                    </View>
                </ScrollView >


            </PaperProvider>
        </ImageBackground>

    );
};
export default Profile;
const styles = StyleSheet.create({
    footerAbsolute: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.51)',
        alignItems: 'center',
        paddingVertical: 10,
    },
    //--- Header
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 10,

    },

    innerContainerPad: {
        paddingBottom: 70,
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
    sectionTitle: {
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },

    avatarIcon: {
        marginTop: 2,
        backgroundColor: '#0FA9A6',
        margin: 'auto',


    },
    userInfo: { marginLeft: 7, },
    userName: { marginTop: 5, color: '#fff', paddingVertical: 1, textAlign: 'center', },

    // --
    cardItemMain: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 0,
        borderWidth: 0.5,
        borderRadius:10,
        borderColor: '#fff',
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },
        activeCardItemMain: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 0,
        borderWidth: 1,
        borderRadius:10,
        borderColor: '#FF5400',
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },

    tickmarkPosition:{
        position:'absolute',
        right:10,
        bottom:15,
        width:30,
        height:30,
    },

    cardContentInner: {
        marginTop: 0,
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardWithIcon: {
        width: 54,
        height: 54,
        backgroundColor: 'transparent',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#fff',
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
        // width:'55%',
       
    },



    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      
    },

    textCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
        flex: 1,
        maxWidth:'86%',
    },

    smallLabel: {
        fontSize: 12,
        color: '#A29F9F',
        marginTop: 8,
    },

    smallTextCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
    },

});