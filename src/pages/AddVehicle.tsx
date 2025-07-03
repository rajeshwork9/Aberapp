import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, Portal, PaperProvider, Button } from 'react-native-paper';


const AddVehicle: React.FC = () => {
    const navigation = useNavigation();

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


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
                        <Text style={styles.headerTitle}>Add Vehicle</Text>
                    </View>
                </View>


                <ScrollView >
                    <View style={styles.container}>
                        <View style={styles.innerContainerPad}>
                            <View style={styles.step1}>
                                <Text style={styles.sectionTitle}>1. Company Details</Text>
                                <View style={styles.formGroup}>
                                    <TextInput
                                        style={styles.formControl}
                                        placeholder="Company Licence Name *"
                                        placeholderTextColor="#9F9F9F"
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
                                        underlineColor="#9F9F9F"
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
                                        placeholderTextColor="#9F9F9F"
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
                                        placeholderTextColor="#9F9F9F"
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
                                        placeholderTextColor="#9F9F9F"
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
                                        placeholderTextColor="#9F9F9F"
                                        textColor='#fff'
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.step2}>
                                <Text style={styles.sectionTitle}>2. Attachments</Text>
                                <Card style={styles.cardItemMain}>
                                    <View style={styles.bulletText}>
                                        <Text style={styles.bulletT}>{'\u2022'}</Text>
                                        <Text style={styles.textB}> Only .Pdf,.Jpg,.Jpeg,.Png Files Are Allowed</Text>
                                    </View>

                                    <View style={styles.bulletText}>
                                        <Text style={styles.bulletT}>{'\u2022'}</Text>
                                        <Text style={styles.textB}>Please Refer The Sample Documents Before
                                            Attaching The Documents. Invalid Documents Will Be Rejected After The
                                            Registration Process.</Text>
                                    </View>

                                    <View style={styles.bulletText}>
                                        <Text style={styles.bulletT}>{'\u2022'}</Text>
                                        <Text style={styles.textB}>For More Than One Truck, Please Upload All Truck License
                                            Document In A Single PDF File As Shown In The Sample Below. Missing A
                                            Document Will Result To Rejection Of The Registration After Payment.</Text>
                                    </View>

                                </Card>

                                <Text style={styles.labelFile}>Company License Document *</Text>
                                <Card style={styles.chooseFileCard}>
                                    <Button mode="elevated" textColor="#000" style={styles.chooseFileBt}>Choose File</Button>
                                    <View style={styles.uploadFileName}>
                                        <Image style={styles.fileIcon} source={require('../../assets/images/download-icon.png')} />
                                        <Text style={styles.fileName}>Download sample company license document</Text>
                                    </View>
                                </Card>

                                <Text style={styles.labelFile}>Company Document *</Text>
                                <Card style={styles.chooseFileCard}>
                                    <Button mode="elevated" textColor="#000" style={styles.chooseFileBt}>Choose File</Button>
                                    <View style={styles.uploadFileName}>
                                        <Image style={styles.fileIcon} source={require('../../assets/images/download-icon.png')} />
                                        <Text style={styles.fileName}>Download sample company license document</Text>
                                    </View>
                                </Card>

                                <Text style={styles.labelFile}>Truck Licence Documents (PDF Only) *</Text>
                                <Card style={styles.chooseFileCard}>
                                    <Button mode="elevated" textColor="#000" style={styles.chooseFileBt}>Choose File</Button>
                                    <View style={styles.uploadFileName}>
                                        <Image style={styles.fileIcon} source={require('../../assets/images/download-icon.png')} />
                                        <Text style={styles.fileName}>Download sample company license document</Text>
                                    </View>
                                </Card>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, marginBottom: 30, }}>
                                    <Button mode="outlined" textColor="#fff" style={styles.clearBt}>Clear Fields</Button>
                                </View>
                            </View>

                            <View style={styles.step3}>
                                <Text style={styles.sectionTitle}>3. Summary</Text>
                                <Card style={styles.cardItemMain}>
                                    <View style={styles.summaryBlock}>
                                        <Text style={styles.summaryLabel}>Truck Count :</Text>
                                        <Text style={styles.summaryText}>1101</Text>
                                    </View>

                                    <View style={styles.summaryBlock}>
                                        <Text style={styles.summaryLabel}>Total Amount To Pay :</Text>
                                        <Text style={styles.summaryText}>4440 AED</Text>
                                    </View>
                                </Card>
                            </View>

                        </View>
                    </View>
                </ScrollView >

                <View style={styles.footerAbsolute}>
                    <View style={styles.buttonRow}>
                        <Button mode="contained" style={styles.closeButton} textColor="#000">Cancel</Button>
                        <Button onPress={showModal} mode="contained" buttonColor="#FF5A00" style={styles.applyButton}>Next</Button>

                        <Portal>
                            <Modal visible={visible} 
                            onDismiss={hideModal}
                             contentContainerStyle={styles.confirmAlert}
                                theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' }, }}>
                                <Text style={{fontSize:19, fontFamily:'Poppins-Medium', textAlign:'center', color:'#fff', marginBottom:20,}}>Are you sure ?</Text>
                                <Icon source="error" size={20}  />
                                
                                <Text style={{fontSize:14, fontFamily:'Poppins-Regular', textAlign:'center', color:'#fff', marginBottom:20,}}>The data and attachment will be saved in the system. you wont be able to
                                     update the transaction after saving !!</Text>

                     <View style={styles.buttonRow}>
                        <Button mode="contained" style={styles.closeButton} textColor="#000">Cancel</Button>
                        <Button mode="contained" buttonColor="#FF5A00" style={styles.applyButton}>Next</Button>
                    </View>
                            </Modal>
                        </Portal>
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

    step1: {

    },

    step2: {},
    step3: {},
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
        paddingTop:30,
        paddingBottom:40,
    },

    sectionTitleModal: {
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },

});