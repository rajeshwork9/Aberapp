import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ImageBackground, Image } from 'react-native';
import { Button, Text, TextInput, Badge, Avatar, Card, PaperProvider } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';

const Topup: React.FC = () => {
    const [country, setCountry] = useState('1');

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path)
    }

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
                        <Text style={styles.headerTitle}>Topup</Text>
                    </View>

                    <View style={styles.headerRightBlock}>
                        <TouchableOpacity style={styles.roundedIconBt} onPress={() => navigateTo('TransactionHistory')}>
                            <Image style={styles.roundedIcon} source={require('../../assets/images/transaction-history-icon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                
            <SafeAreaView style={styles.container}>


                <View style={styles.balanceCard}>
                    <Image style={styles.imgWalletBalance} source={require('../../assets/images/wallet-icon.png')} />
                    <Card style={styles.balanceContent}>
                        <Text style={styles.balanceLabel}>1,345.00</Text>
                        <Text style={styles.textBalance}>Available Balance (AED)</Text>
                    </Card>
                </View>

                <View style={styles.bottomCard}>
                    <Text style={styles.sectionTitle}>Add money to wallet</Text>
                    <Text style={styles.subTitle}>Amount in AED</Text>

                    <View style={styles.amountRow}>
                        <TouchableOpacity style={[styles.amountBt,]}>
                            <Text style={[styles.amountText,]}>
                                50
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.selectedAmountBt,]}>
                            <Text style={[styles.selectedAmountText,]}>
                                500
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.amountBt,]}>
                            <Text style={[styles.amountText,]}>
                                1000
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.amountBt,]}>
                            <Text style={[styles.amountText,]}>
                                5000
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.orText}>OR</Text>

                    <TextInput
                        style={styles.amountInput}
                        placeholder="Enter Custom Value"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        cursorColor="#fff"
                        textColor='#fff'

                    />

                    <Text style={styles.textMax}>
                        Max Payment Value is 2,00,000 AED
                    </Text>

                    <Button mode="contained" style={[styles.primaryBt,{backgroundColor:'#FF5400', }]}>
                        Proceed to add money
                    </Button>

                </View>



            </SafeAreaView >
    </PaperProvider>
        </ImageBackground>
    );
};
export default Topup;
const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        marginHorizontal: 0,
        marginTop: 70,
    },

    balanceCard: {
        marginTop: 16,
        backgroundColor: 'transparent',
        marginHorizontal: 5,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center',
    },

    balanceContent: {
        backgroundColor: 'transparent',
        marginHorizontal: 10,
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        shadowColor: 'transparent',
    },
    balanceLabel: {
        marginTop: 4, fontSize: 25, fontWeight: 'bold', textAlign: 'left', color: '#fff',
    },
    textBalance: {
        fontSize: 9, color: '#fff',
    },

    imgWalletBalance: {
        width: 40,
        height: 40,
        tintColor: 'white'
    },

    bottomCard: {
        position: 'absolute',
        bottom: -20,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    sectionTitle: {
        fontSize: 16,
        color: '#fff'
    },
    subTitle: { color: '#fff', fontSize: 11, },

    amountRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    amountBt: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 30,
        width: '22%',
        alignItems: 'center',
        marginVertical: 5,
    },
    selectedAmountBt: {
        backgroundColor: '#ff5200',
        padding: 10,
        borderRadius: 30,
        width: '22%',
        alignItems: 'center',
        marginVertical: 5,
    },
    amountText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 13,
    },

    selectedAmountText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },


    orText: {
        textAlign: 'center',
        color: '#fff',
        marginVertical: 4,
        fontSize: 11,
    },

    amountInput: {
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',

        backgroundColor: 'transparent',
    },
    textProceed: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',

    },
    textMax: {
        textAlign: 'right',
        color: '#ccc',
        fontStyle: 'italic',
        marginVertical: 10,
        fontSize: 11,
    },

    primaryBt: {
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
    },



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



});