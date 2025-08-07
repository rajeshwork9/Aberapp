import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, Portal, PaperProvider, Button, IconButton } from 'react-native-paper';
import { Animated } from 'react-native';
import { MainStackParamList } from '../../App';
import { getLicenceNumber, getTodaysTrips, getOverallClasses, getTransactionStatus } from '../services/common';


type TripDetailsRouteProp = RouteProp<MainStackParamList, 'TripsDetails'>;

interface LPN {
    label: string;
    value: string;
    AssetIdentifier: string;
    OverallClassId: number;
}

const TripsDetails: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<TripDetailsRouteProp>();
    const tripDetails = route.params.state;
    console.log(tripDetails);

    // modal popup useset
    const [visible, setVisible] = React.useState(false);
    const [lpnData, setLpnData] = useState<LPN[] | any>([]);
    const [typesData, setTypesData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);


    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        if (tripDetails.AccountId) {
            licenceNumber(tripDetails.AccountId);
            getTypes();
            getTransactionStatusData();
        }
    }, [tripDetails]);
    const getTypes = async () => {
        try {
            const response = await getOverallClasses();
            console.log(response);
            setTypesData(response);
        }
        catch (error: any) {
            console.error(error);
        }
        finally {
            console.log('api comopleted');

        }
    };
    const licenceNumber = async (accountId: any) => {
        try {
            let payload = {
                accountId: accountId,
                assetTypeId: 2 //static
            }
            const response = await getLicenceNumber(payload);
            const formatted = response.map((item: any) => ({
                ...item,
                label: item.AssetIdentifier,
                value: item.AccountUnitId
            }));

            setLpnData(formatted);
            console.log(lpnData, "lpn data");

        }
        catch (error) {
            console.error('License fetch failed:', error);
        }
        finally {

        }
    }
    const getClassNameFromVRM = (vrm: string) => {
        const lpnMatch = lpnData.find((d: any) => d.AssetIdentifier === vrm);
        if (!lpnMatch) return '—';
        const classId = lpnMatch.OverallClassId;
        const className = typesData.find((t: any) => t.ItemId === classId)?.ItemName;
        return className ?? '—';
    };

    const getTransactionStatusData = async () => {
        try {
            const response = await getTransactionStatus();
            console.log(response);
            setStatusData(response);
        }
        catch (error: any) {
            console.error(error);
        }
        finally {
            console.log('api comopleted');

        }
    }
    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <View style={styles.container}>
                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={[styles.backBt, { marginRight: 12, }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Trip Details</Text>
                    </View>
                </View>
                <View style={styles.containerInner}>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Identifier</Text>
                            <Text style={styles.LabelValue}>{tripDetails.VRM ? tripDetails.VRM : '-'}</Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Date & Time</Text>
                            <Text style={styles.LabelValue}>{tripDetails.TransactionDate}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Trip ID</Text>
                            <Text style={styles.LabelValue}> {tripDetails.TransactionId ? tripDetails.TransactionId : '-'} </Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Entry Location</Text>
                            <Text style={styles.LabelValue}> {tripDetails.LocationName ? tripDetails.LocationName : '-'} </Text>
                        </View>
                    </View>
                    <View style={styles.Box}>

                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Financial</Text>
                            <Text style={styles.LabelValue}> {tripDetails.Finincal ? tripDetails.Financial : '-'} </Text>
                        </View>
                        <View >
                            <Text style={styles.LabelText}>RFID</Text>
                            <Text style={styles.LabelValue}>{tripDetails.rfid ? tripDetails.rfid : '-'} </Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Class</Text>
                            <Text style={styles.LabelValue}>{getClassNameFromVRM(tripDetails.VRM)}</Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Weight</Text>
                            <Text style={styles.LabelValue}>{tripDetails.weight ? tripDetails.weight : '-'}</Text>
                        </View>

                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Amount(AED)</Text>
                            <Text style={styles.LabelValue}>{tripDetails.AmountFinal}</Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Status</Text>
                            <Text style={styles.LabelValue}>{statusData.find((data: any) => tripDetails.StatusId == data.ItemId)?.ItemName}</Text>
                        </View>

                    </View>
                    <View style={styles.Box}>


                    </View>

                    <Button mode="contained" style={styles.orangeButton} > {/*onPress={() => showModal()} */}
                        <Image style={{ width: 16, height: 16, }} source={require('../../assets/images/chat-icon.png')} /> Dispute Trip
                    </Button>



                    <Portal>
                        <Modal
                            visible={visible}
                            onDismiss={hideModal}
                            contentContainerStyle={styles.modalBottomContainer}
                        >
                            {/* Close Icon */}
                            <IconButton
                                icon="close"
                                size={24}
                                onPress={hideModal}
                                style={styles.modalCloseIcon}
                                iconColor="#fff"
                            />

                            <Text style={styles.sectionTitleModal}>Dispute Trip</Text>
                            <View style={styles.cardContentInner}>
                                <View style={styles.leftCardCont}>
                                    <View style={styles.leftTextCard}>
                                        <Text style={styles.textCard}>
                                            36487-AE-UQ-PRI_A{"\n"}
                                            G2 Ring Road{"\n"}
                                            07 Mar 2025, 10:50:01
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.rightTextCard}>
                                    <Text style={[styles.textCard, { fontWeight: 'bold' }]}>3X</Text>
                                    <Text style={styles.GreenText}> Paid <Text style={[styles.GreenText, { fontWeight: 'bold' }]}>300</Text></Text>
                                    <Image style={{ width: 16, height: 16, marginVertical: 4 }} source={require('../../assets/images/chat-icon.png')} />
                                </View>
                            </View>
                            <View style={styles.formGroup}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.formControl}
                                        placeholder="Enter Reason For Dispute"
                                        placeholderTextColor="#9F9F9F"
                                        // keyboardType="numeric"
                                        cursorColor="#fff"
                                        textColor="#fff"
                                        theme={{
                                            colors: {
                                                primary: '#FF5400',
                                            },
                                        }}
                                    />
                                    <Text style={styles.minText}>Min 240 Characters</Text>
                                </View>

                            </View>

                            {/* Buttons */}
                            <View style={styles.buttonRow}>
                                <Button mode="contained" style={styles.closeButton} textColor="#000">
                                    Close
                                </Button>
                                <Button
                                    mode="contained"
                                    buttonColor="#FF5A00"
                                    style={styles.applyButton}>
                                    Submit
                                </Button>
                            </View>
                        </Modal>
                    </Portal>


                </View>
            </View>
        </ImageBackground>

    );
};
export default TripsDetails;

const styles = StyleSheet.create({
    //--- Header

    wrapper: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderStyle: 'dotted', // Could be 'solid' for star pattern illusion
        borderColor: '#FF5400',
        backgroundColor: '#fff',
        paddingHorizontal: 5,
        paddingVertical: 5,
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

    container: {
        flex: 1,
        marginHorizontal: 5,
        marginTop: 10,

    },
    containerInner: {
        marginHorizontal: 15,
        marginTop: 30,
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
        marginTop: 12,
    },
    Box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 25
    },
    leftDiv: {
        width: '55%',
    },
    LabelText: {
        fontSize: 12,
        color: '#fff',
        paddingVertical: 4
    },
    LabelValue: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold'
    },

    headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start', },
    headerRightBlock: { flexDirection: 'row', justifyContent: 'flex-end', },
    headerIcon: { width: 18, height: 18, },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },


    btHeader: {
        backgroundColor: '#ff5200', borderRadius: 100,
        textAlign: 'center', alignSelf: 'flex-start', paddingTop: 5, paddingBottom: 7,
    },
    btHeaderText: { color: '#fff', fontSize: 13, paddingHorizontal: 10, },
    orangeButton: {
        width: '100%',
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 0,
        backgroundColor: '#FF5A00',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50

    },

    cardContentInner: {
        marginTop: 0,
        borderRadius: 50,
        paddingVertical: 10,
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '71%',
    },
    textCard: {
        fontSize: 13,
        color: '#fff',
        paddingBottom: 2,
        lineHeight: 20
    },
    GreenText: {
        color: '#06F547',
        fontSize: 12,
    },

    deateCard: {
        fontSize: 11,
        color: '#fff',
        paddingTop: 6,

    },
    rightTextCard: {

        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'column',
    },

    largeTextRCard: {
        color: '#fff',
        fontSize: 16,

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
    inputWrapper: {
        position: 'relative',
        marginBottom: 24,
    },
    minText: {
        position: 'absolute',
        bottom: -22,        // push below input
        right: 0,           // align to right
        fontSize: 12,
        color: '#9F9F9F',
    },

    // modal popup css
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
        paddingHorizontal: 0,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 10, },

    calendarInputModal: {
        paddingHorizontal: 40,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    calendarIcon: { position: 'absolute', left: 5, bottom: 11, width: 20, height: 20, },


    selectDropdown: {
        width: '100%',
        marginHorizontal: 0,
        height: 40,
        backgroundColor: '#000000',
        borderRadius: 0,
        color: '#fff',
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderWidth: 1,
        borderBottomColor: '#fff',
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
    backBt: {},
    leftTextCard: {}
});