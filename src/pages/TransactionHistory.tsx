import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image, } from 'react-native';
import { Button, TextInput, Modal, Portal, Text, Badge, Avatar, Card, IconButton, PaperProvider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

const TransactionHistory: React.FC = () => {
    const [search, setSearch] = React.useState('');

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path)
    }
     const [value, setValue] = useState(null);

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
                        <Text style={styles.headerTitle}>Transaction History</Text>
                    </View>

                    <View style={styles.headerRightBlock}>
                        <TouchableOpacity style={styles.roundedIconBt} onPress={() => showModal()}>
                            <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                        </TouchableOpacity>

                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBottomContainer}>
                                {/* Close Icon */}
                                <IconButton
                                    icon="close"
                                    size={24}
                                    onPress={hideModal}
                                    style={styles.modalCloseIcon}
                                    iconColor="#fff"
                                />
                                <Text style={styles.sectionTitleModal}>Transaction Filters</Text>
                                       
                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>Form Date</Text>
                                    <TextInput
                                        mode="flat"
                                        placeholder='DD-MM-YYYY'
                                        style={styles.calendarInputModal}
                                        underlineColor="#fff"
                                        placeholderTextColor="#707070"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
                                    <Image style={styles.calendarIcon} source={require('../../assets/images/calendar-icon.png')} />
                                </View>

                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>To Date</Text>
                                    <TextInput
                                        mode="flat"
                                        style={styles.calendarInputModal}
                                        underlineColor="#fff"
                                        placeholder='DD-MM-YYYY'
                                        placeholderTextColor="#707070"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
                                    <Image style={styles.calendarIcon} source={require('../../assets/images/calendar-icon.png')} />
                                </View>

                                <View style={styles.buttonRow}>
                                    <Button
                                        mode="contained"
                                        onPress={hideModal}
                                        style={styles.closeButton}
                                        textColor="#000"
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        mode="contained"
                                        onPress={() => {
                                            hideModal();
                                        }}
                                        buttonColor="#FF5A00"
                                        style={styles.applyButton}
                                    >
                                        Apply
                                    </Button>
                                </View>

                            </Modal>
                        </Portal>
                    </View>
                </View>

                <ScrollView style={styles.container}>
                    <View>
                        <View style={styles.searchBlock}>
                            <TextInput style={styles.searchFormInput} placeholder="Search" placeholderTextColor="#7B8994"
                                value={search} onChangeText={setSearch}
                                mode="outlined"
                                theme={{ roundness: 100, colors: { text: '#000', primary: '#000', background: '#fff' } }}
                            />
                            <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} ></Image>
                        </View>

                        <Card style={styles.cardItemMain}>
                            <View style={styles.cardContentInner}>
                                <View style={styles.leftCardCont}>
                                    <Card style={styles.cardWithIcon}>
                                        <Image style={styles.cardIconImg} source={require('../../assets/images/transaction-icon.png')} />
                                    </Card>

                                    <View style={styles.leftTextCard}>
                                        <Text style={[styles.textCard, {fontFamily:'Poppins-SemiBold'}]}>Transaction ID - 157695</Text>
                                        <Text style={styles.textCard}>07 Mar 2025, 10:50:01</Text>
                                    </View>
                                </View>
                                <View style={styles.rightTextCard}>
                                         <Image style={styles.tranupIcon} source={require('../../assets/images/tranup-icon.png')} /> 
                                        <Text style={[styles.statusText, {fontFamily:'Poppins-SemiBold'}]}> 700</Text>
                                </View>
                            </View>
                        </Card>             
                    </View>

                </ScrollView >
            </PaperProvider>
        </ImageBackground>
    );
};
export default TransactionHistory;
const styles = StyleSheet.create({

    //--- Header
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    container: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 20,
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

        flexDirection: 'row', alignItems: 'center',
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
        marginRight: 5,
        padding: 0,
    },

    cardIconImg: {
        width: 25,
        height:25,
        tintColor: 'white'
    },

    tranupIcon:{
        width:18,
        height:18,
        marginRight:3,
    },

    leftTextCard: {
        // paddingRight: 10,
    },

    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        width: '71%',
    },

    textCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
    },
    rightTextCard: {
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight:6,
    },

    largeTextRCard: {
        color: '#fff',
        fontSize: 16,

    },
    statusTextCard: {
       
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 30,
        marginTop: 5,
    },
    statusText: {color: '#06F547',  fontSize: 14,},

    //--


    // --
    modalBottomContainer: {
        backgroundColor: '#000',
        paddingHorizontal: 25,
        marginHorizontal: 0,
        borderRadius: 20,
        position: 'absolute',
        bottom: -10,
        left: 0,
        right: 0,
        color: '#fff',
        paddingTop: 15,
        paddingBottom: 65,
    },

    sectionTitleModal: {
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },

    formGroupModal: { marginTop: 10, marginBottom: 15, },
    inputModal: {
        paddingHorizontal:0,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 10, },

        calendarInputModal:{
         paddingHorizontal:40,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    calendarIcon:{position:'absolute', left:5, bottom:11, width:20, height:20,},

    
     selectDropdown: {
        width: '100%',
        marginHorizontal: 0,
        height:40,
        backgroundColor: '#000000',
        borderRadius: 0,
        color: '#fff',
        paddingHorizontal:0,
        paddingVertical:0,
        borderWidth:1,
        borderBottomColor:'#fff',
    },

    placeholderSelect: {
        fontSize: 13,
        color: '#BDBDBD',
    },
    selectedTextStyle: {
        fontSize: 14,
        marginLeft: 6,
        color: '#fff',
    },

    dropdownList : {       
       backgroundColor:'#222',
        borderColor: '#222',
        borderRadius: 4,
         paddingVertical:6,

        
        
    },

    listSelectGroup:{backgroundColor:'#222', 
        paddingVertical:10,
        paddingHorizontal:15,
    },
    itemTextSelect:{
        backgroundColor:'transparent',
        color: '#fff',
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    applyButton: {
        width: 120,
        paddingTop: 0,
        paddingBottom: 4,
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 10,


    },

    closeButton: {
        width: 120,
        paddingTop: 0,
        paddingBottom: 4,
        backgroundColor: '#FFFFFF',
        color: '#000',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 10,
    },
     modalCloseIcon: {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 10,
},


});