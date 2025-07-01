import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, TextInput, Modal, Portal, PaperProvider, Button } from 'react-native-paper';


const AddVehicle: React.FC = () => {
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
                        <Text style={styles.headerTitle}>Add Vehicles</Text>
                    </View>
                </View>


                <ScrollView style={styles.container}>
                   <View style={styles.innerContainerPad}>
                    <Text style={styles.sectionTitle}>1. Company Details</Text>
                    <View style={styles.formGroup}>


                        <TextInput
                            style={styles.formControl}
                            placeholder="Company Licence Name *"
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

                    <View style={styles.formGroup}>
                        <TextInput
                            mode="flat"
                            placeholder="Enter Company Licence Number *"
                            style={styles.formControl}
                            underlineColor="#fff"
                            placeholderTextColor="#ccc"
                            textColor='#fff'
                            theme={{
                                colors: {
                                    primary: '#FF5400',
                                },
                            }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <TextInput
                            mode="flat"
                            placeholder="No Of Trucks To Register  *"
                            style={styles.formControl}
                            underlineColor="#fff"
                            placeholderTextColor="#ccc"
                            textColor='#fff'
                            theme={{
                                colors: {
                                    primary: '#FF5400',
                                },
                            }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <TextInput
                            mode="flat"
                            placeholder="Email *"
                            style={styles.formControl}
                            underlineColor="#fff"
                            placeholderTextColor="#ccc"
                            textColor='#fff'
                            theme={{
                                colors: {
                                    primary: '#FF5400',
                                },
                            }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <TextInput
                            mode="flat"
                            placeholder="Mobile No *"
                            style={styles.formControl}
                            underlineColor="#fff"
                            placeholderTextColor="#ccc"
                            textColor='#fff'
                            theme={{
                                colors: {
                                    primary: '#FF5400',
                                },
                            }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <TextInput
                            mode="flat"
                            placeholder="Company Details*"
                            style={styles.formControl}
                            underlineColor="#fff"
                            placeholderTextColor="#ccc"
                            textColor='#fff'
                            theme={{
                                colors: {
                                    primary: '#FF5400',
                                },
                            }}
                        />
                    </View>
                </View> 
                </ScrollView >

                <View style={styles.footerAbsolute}>
                    <View style={styles.buttonRow}>
                        <Button
                            mode="contained"
                            onPress={hideModal}
                            style={styles.closeButton}
                            textColor="#000"
                        >
                            Cancel
                        </Button>

                        <Button
                            mode="contained"
                            onPress={() => {
                                hideModal();
                            }}
                            buttonColor="#FF5A00"
                            style={styles.applyButton}
                        >
                            Next
                        </Button>
                    </View>
                </View>
            </PaperProvider>
        </ImageBackground>

    );
};
export default AddVehicle;
const styles = StyleSheet.create({
    footerAbsolute: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding:0,
        backgroundColor:'rgba(0, 0, 0, 0.51)',
        alignItems: 'center',
        paddingVertical:10,
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

    innerContainerPad:{
paddingBottom:70,
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
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },


    formGroup: { marginTop: 10, marginBottom: 15, },
    formControl: {
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    formLabel: { color: '#fff', fontSize: 13, marginBottom: 10, },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    applyButton: {
        paddingTop: 0,
        paddingBottom: 3,
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 0,
        fontSize: 13,
        marginHorizontal: 10,
        width:130,


    },

    closeButton: {
         width:130,
        paddingTop: 0,
        paddingBottom: 3,
        backgroundColor: '#FFFFFF',
        color: '#000',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 0,
        fontSize: 13,
        marginHorizontal: 10,
    },
});