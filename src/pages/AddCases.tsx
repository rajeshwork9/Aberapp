import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, Portal, PaperProvider, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';


const AddCases: React.FC = () => {
    const navigation = useNavigation();


    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <View style={styles.container}>
                <PaperProvider>
                    <View style={styles.headerMain}>
                        <View style={styles.headerLeftBlock} >
                            <TouchableOpacity style={[styles.backBt, { marginRight: 12, }]} onPress={() => navigation.goBack()}>
                                <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Add New Cases</Text>
                        </View>
                    </View>

                    <ScrollView >
                        <View style={styles.containerInner}>
                            <View style={styles.box1}>
                                <View style={styles.formGroup}>
                                    <RNPickerSelect
                                        onValueChange={(value) => console.log(value)}
                                        items={[
                                            { label: 'Football', value: 'football' },
                                            { label: 'Baseball', value: 'baseball' },
                                            { label: 'Hockey', value: 'hockey' },
                                        ]}
                                    />
                                    {/* <Picker
                                        selectedValue={selectedOption}
                                        onValueChange={(itemValue) => setSelectedOption(itemValue)}
                                        style={styles.picker}
                                        dropdownIconColor="#fff"
                                    >
                                        <Picker.Item label="-- Select License --" value="" />
                                        <Picker.Item label="License A" value="license_a" />
                                        <Picker.Item label="License B" value="license_b" />
                                        <Picker.Item label="License C" value="license_c" />
                                    </Picker>  */}
                                </View>
                                {/* {selectedOption ? (
                                    <Text style={styles.selectedText}>Selected: {selectedOption}</Text>
                                ) : null} */}
                            </View>
                        </View>
                    </ScrollView>

                </PaperProvider>
            </View>
        </ImageBackground>

    );
};
export default AddCases;

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
        marginHorizontal: 5,
        marginTop: 10,

    },
    label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  picker: {
    height: 50,
    color: '#fff',
  },
  selectedText: {
    color: '#FF5400',
    marginTop: 16,
    fontSize: 16,
  },
    containerInner: {
        marginHorizontal: 40,
        marginTop: 10,

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
        fontFamily: 'Poppins-Medium',
    },

    labelFile: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 14,
        color: '#fff',
        fontWeight: 'normal',
        fontFamily: 'Poppins-Regular',
    },


    formGroup: { marginTop: 10, marginBottom: 15, },
    formControl: {
        paddingHorizontal: 0,
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
        width: 130,


    },

    closeButton: {
        width: 130,
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

    box1: {

    },
    cardItemMain: {
        borderWidth: 0,
        paddingVertical: 15,
        marginTop: 0,
        marginHorizontal: 0,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },
    bulletText: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    bulletT: {
        fontSize: 23,
        color: '#FF5400',
        lineHeight: 22,
    },
    textB: {
        fontSize: 14,
        color: '#FF5400',
        lineHeight: 22,
        fontWeight: 400,
        paddingLeft: 5,
        paddingRight: 10,
    },

    uploadFileName: {
        paddingLeft: 0,
        paddingRight: 10,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    fileIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    fileName: {
        fontSize: 14,
        color: '#FF5400',
        lineHeight: 22,
        fontWeight: 400,
        paddingLeft: 5,
        paddingRight: 10,
        fontFamily: 'Poppins-Regular',
    },
    chooseFileBt: {
        width: 150,
        fontFamily: 'Poppins-Regular',

        marginBottom: 15,
        borderRadius: 10,
    },

    chooseFileCard: {
        borderWidth: 0,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 0,
        marginHorizontal: 0,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },

    clearBt: {
        borderColor: '#FF5400',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 150,
        borderRadius: 60,
        paddingVertical: 5,
        fontFamily: 'Poppins-Regular',
    },

    summaryBlock: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        marginBottom: 10,
    },

    summaryText: {
        color: '#fff',
        fontSize: 14,

    },

    summaryLabel: {
        color: '#fff',
        fontSize: 14,
        width: 180,
    },

    confirmAlert: {
        backgroundColor: '#000',
        paddingHorizontal: 25,
        marginHorizontal: 20,
        borderRadius: 20,
        color: '#fff',
        paddingTop: 30,
        paddingBottom: 40,
    },

    sectionTitleModal: {
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },

});