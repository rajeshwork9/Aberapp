import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MainStackParamList } from '../../App';
import dayjs from 'dayjs';
import RNFS from 'react-native-fs';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { ToastService } from '../utils/ToastService';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


type StatementDetailsProp = RouteProp<MainStackParamList, 'StatementDetails'>;

const StatetmentDetails: React.FC = () => {
    const route = useRoute<StatementDetailsProp>();
    const statetmentDetails = route.params.state;
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
        const handleDownload = async (base64Data: string, filename = 'statement.pdf') => {
            try {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Storage Permission Required',
                            message: 'App needs access to your storage to download the file',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
    
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        ToastService.error('Permission Denied', 'Storage permission is required to download the file.');
                        return;
                    }
                }
    
                const path = `${RNFS.DownloadDirectoryPath}/${filename}`;
                await RNFS.writeFile(path, base64Data, 'base64');
    
                ToastService.success('Download Successful', `File saved to ${path}`);
                console.log('File downloaded to:', path);
            } catch (error) {
                console.error('Download error:', error);
                ToastService.error('Download Failed', 'There was an error saving the file.');
            }
        };

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={[{ marginRight: 12, }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Statement Details</Text>
                    </View>
                </View>
                <View style={styles.containerInner}>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>File Name</Text>
                            <Text style={styles.LabelValue}> {statetmentDetails.FinancialDocumentID ? statetmentDetails.FinancialDocumentID : '-'} </Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Reference Number</Text>
                            <Text style={styles.LabelValue}>{statetmentDetails.ReferenceNumber ? statetmentDetails.ReferenceNumber : '-'} </Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Period From </Text>
                            <Text style={styles.LabelValue}>{statetmentDetails.PeriodFrom ? dayjs(statetmentDetails.PeriodFrom).format('DD MMM YYYY') : '-'}</Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Period To</Text>
                            <Text style={styles.LabelValue}>{statetmentDetails.PeriodTo ? dayjs(statetmentDetails.PeriodTo).format('DD MMM YYYY') : '-'}</Text>
                        </View>
                    </View>
                    {/* <View style={styles.downloadBox}>
                        <Button onPress={() => handleDownload(statetmentDetails.DocumentContent, `Statement-${statetmentDetails.FinancialDocumentID}-${dayjs(statetmentDetails.PeriodTo).format('YYYY-MM-DD')}.pdf`)} style={styles.downloadBtn}>
                            Download
                        </Button>
                    </View> */}

                </View>
            </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default StatetmentDetails;

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
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: 5,
        marginTop: 10,

    },
    containerInner: {
        marginHorizontal: 15,
        marginTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    headerMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: 'transparent',
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
    downloadBtn:{
        borderColor: '#ff5200',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        width: 100,
    },
    downloadBox:{
        width:100
    }
});