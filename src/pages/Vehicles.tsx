import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, TextInput, Modal, Portal, PaperProvider, Button } from 'react-native-paper';


const Vehicles: React.FC = () => {
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
                        <TouchableOpacity style={[styles.backBt, {marginRight:12,}]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Vehicles</Text>
                    </View>

                    <View style={styles.headerRightBlock}>
                        <TouchableOpacity style={[styles.btHeader, { marginRight: 12, }]}>
                            <Text style={styles.btHeaderText}>Add Vehicle</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.roundedIconBt} onPress={() => showModal()}>
                            <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                        </TouchableOpacity>

                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBottomContainer}>

                                <Text style={styles.sectionTitleModal}>Trip Filters</Text>
                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>Gantry</Text>
                                    <TextInput
                                        style={styles.inputModal}
                                        placeholder="Enter Custom Value"
                                        placeholderTextColor="#ccc"
                                        keyboardType="numeric"
                                        cursorColor="#fff"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}

                                    />
                                </View>

                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>Licence Plate Number</Text>
                                    <TextInput
                                        mode="flat"
                                        placeholder="Select Gantry"
                                        style={styles.inputModal}
                                        underlineColor="#fff"
                                        placeholderTextColor="#707070"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
                                </View>


                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>From Date</Text>
                                    <TextInput
                                        mode="flat"
                                        left={<TextInput.Icon icon="calendar" />}
                                        style={styles.inputModal}
                                        underlineColor="#fff"
                                        placeholderTextColor="#707070"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
                                </View>


                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>To Date</Text>
                                    <TextInput
                                        mode="flat"
                                        left={<TextInput.Icon icon="calendar" />}
                                        style={styles.inputModal}
                                        underlineColor="#fff"
                                        placeholderTextColor="#707070"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
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
                                        <Image style={styles.cardIconImg} source={require('../../assets/images/vehicles-icon.png')} />
                                    </Card>

                                    <View style={styles.leftTextCard}>
                                        <Text style={styles.textCard}>36487-AE-UQ-PRI_A</Text>
                                        <Text style={[styles.deateCard, { fontWeight: 'light' }]}>07 Mar 2025, 10:50:01</Text>
                                    </View>
                                </View>
                                <View style={styles.rightTextCard}>
                                    <Text style={styles.largeTextRCard}>3XL</Text>
                                    <Text style={styles.statusTextCard}>
                                        <Text style={[styles.statusText, { fontWeight: 'normal' }]}>Active</Text>

                                    </Text>
                                    {/* <Text style={{ color: index === 0 ? 'green' : 'red' }}>
                                    {index === 0 ? 'Paid : 300' : 'Unpaid : 300'}
                                </Text> */}
                                </View>
                            </View>
                        </Card>
                    </View>




                </ScrollView >


            </PaperProvider>
        </ImageBackground>

    );
};
export default Vehicles;
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
        marginTop:20,
    },

    headerMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal:15,
        paddingVertical:6,
        backgroundColor:'transparent',
        marginTop:12,
       
    },
    backBt:{  },
    headerLeftBlock: {flexDirection: 'row',justifyContent: 'flex-start',},
    headerRightBlock: { flexDirection: 'row',justifyContent: 'flex-end', },
    headerIcon: { width:18, height:18, },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },


    btHeader: {backgroundColor: '#ff5200',borderRadius: 100,
    textAlign: 'center',alignSelf: 'flex-start',paddingTop: 5,paddingBottom: 7,},
    btHeaderText: {color: '#fff',fontSize: 13,paddingHorizontal: 10,},

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
        marginTop:0,
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
        marginTop: 5,
    },
    statusText: {
        color: '#06F547',
        // unpaid  color: '#FF4141',

    },

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
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 10, },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    applyButton: {

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
});