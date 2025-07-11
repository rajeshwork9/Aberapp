import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, Portal, PaperProvider, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Dropdown } from 'react-native-element-dropdown';


const AddCases: React.FC = () => {
    const navigation = useNavigation();
    const [value, setValue] = useState(null);

     const accountId = [
        { label: '12345', statusvalue: '1' },
    ];
     const CaseType = [
        { label: 'Select Case Type', statusvalue: '1' },
    ];

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
                            <View style={styles.formGroupModal}>
                                <Text style={styles.labelModal}>Account Id</Text>
                                <Dropdown
                                    style={styles.selectDropdown}
                                    placeholderStyle={styles.placeholderSelect}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={accountId}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select item"
                                    containerStyle={styles.dropdownList}
                                    activeColor="#000000"
                                    value={null}
                                    onChange={item => setValue(item.value)}
                                    renderItem={item => (
                                        <View style={styles.listSelectGroup}>
                                            <Text style={styles.itemTextSelect}>{item.label}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                            <View style={styles.formGroupModal}>
                                <Text style={styles.labelModal}>Case Type</Text>
                                <Dropdown
                                    style={styles.selectDropdown}
                                    placeholderStyle={styles.placeholderSelect}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={CaseType}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select item"
                                    containerStyle={styles.dropdownList}
                                    activeColor="#000000"
                                    value={null}
                                    onChange={item => setValue(item.value)}
                                    renderItem={item => (
                                        <View style={styles.listSelectGroup}>
                                            <Text style={styles.itemTextSelect}>{item.label}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                             <View style={styles.formGroupModal}>
                                <Text style={styles.labelModal}>Message</Text>
                                <TextInput
                                    style={styles.formControl}
                                    placeholder="Enter your Message here"
                                    placeholderTextColor="#9F9F9F"
                                    cursorColor="#fff"
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
                                    style={styles.closeButton}
                                    textColor="#000"
                                >
                                    Close
                                </Button>

                                <Button
                                    mode="contained"
                                  
                                    buttonColor="#FF5A00"
                                    style={styles.applyButton}
                                >
                                    Add
                                </Button>
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

    //--- Header End

    //---

    formGroupModal: { marginTop: 10, marginBottom: 25, },
  

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 5, },
     selectDropdown: {
        width: '100%',
        marginHorizontal: 0,
        height: 50,
        borderRadius: 0,
        color: '#fff',
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderBottomColor: '#fff',
        borderBottomWidth:1
    },
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

    placeholderSelect: {
        fontSize: 13,
        color: '#BDBDBD',
    },
    selectedTextStyle: {
        fontSize: 14,
        marginLeft: 6,
        color: '#fff',
    },

    dropdownList: {
        backgroundColor: '#222',
        borderColor: '#222',
        borderRadius: 4,
        paddingVertical: 6,



    },

    listSelectGroup: {
        backgroundColor: '#222',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    itemTextSelect: {
        backgroundColor: 'transparent',
        color: '#fff',
    },
 buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    applyButton: {
        width: 150,
        paddingTop: 0,
        paddingBottom: 4,
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 0,


    },

    closeButton: {
        width: 150,
        paddingTop: 0,
        paddingBottom: 4,
        backgroundColor: '#FFFFFF',
        color: '#000',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 0,
    },

});