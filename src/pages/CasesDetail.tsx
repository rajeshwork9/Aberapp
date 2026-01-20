import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MainStackParamList } from '../../App';
import dayjs from 'dayjs';
import { getCasesStatus } from '../services/common';    
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type CasesDetailsRouteProp = RouteProp<MainStackParamList, 'VehicleDetails'>;

const CasesDetail: React.FC = () => {
    const route = useRoute<CasesDetailsRouteProp>();
    const caseDetails = route.params.state;
    console.log(caseDetails);
    const statusColors: Record<number, string> = {
        2: '#808080',  // Closed - Gray
        4: '#FFA500',  // Pending - Orange
        5: '#28A745',  // Active - Green
        6: '#17A2B8',  // In Progress - Blue
        7: '#b394ecff',  // Assigned - Purple
        8: '#FFC107',  // Reopened - Amber
        9: '#DC3545',  // Escalated - Red
    };
    const navigation = useNavigation();

    const [caseStatusData, setCaseStatusData] = useState<any[]>([]);

    useEffect(() => {
        getCaseStatusData();
    }, [])
    const getCaseStatusData = async () => {
        try {
            const response = await getCasesStatus(); // ✅ properly awaited
            console.log("Case status:", response);
            // If response is directly the array (like your `_j`)
            if (Array.isArray(response)) {
                setCaseStatusData(response);
            }

            // If it’s inside response._j (not ideal, but fallback)
            else if (response?._j) {
                setCaseStatusData(response._j);
            }
        } catch (err) {
            console.error('Error fetching case status:', err);
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
                        <Text style={styles.headerTitle}>Case Details</Text>
                    </View>
                </View>
                <View style={styles.containerInner}>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Responsible Area</Text>
                            <Text style={styles.LabelValue}> {caseDetails.ResponsibleArea ? caseDetails.ResponsibleArea : '-'} </Text>
                        </View>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Case ID</Text>
                            <Text style={styles.LabelValue}>{caseDetails.CaseId}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Case Type</Text>
                            <Text style={styles.LabelValue}>{caseDetails.CaseType ? caseDetails.CaseType : '-'} </Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Description</Text>
                            <Text style={styles.LabelValue}>{caseDetails.ShortDescription}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                            <Text style={styles.LabelText}>Create Date</Text>
                            <Text style={styles.LabelValue}>{caseDetails.CreationDate ? dayjs(caseDetails.ValidFromDate).format('DD MMM YYYY') : '-'}</Text>
                        </View>
                        <View>
                            <Text style={styles.LabelText}>Create Time  </Text>
                            <Text style={styles.LabelValue}>{caseDetails.CreationDate ? dayjs(caseDetails.ValidToDate).format('hh:mm') : '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.Box}>
                        <View>
                            <Text style={styles.LabelText}>Status</Text>
                            <Text style={[styles.activeText, { fontWeight: 'normal', color: statusColors[caseDetails.StatusId] || '#000' }]}>{caseStatusData.find((data: any) => data.ItemId == caseDetails.StatusId)?.ItemName} </Text>
                        </View>
                    </View>
                </View>
            </View> 
            </SafeAreaView>
        </ImageBackground>
    )
}
export default CasesDetail;

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
    activeText: {
        color: '#06F547',
    },

});
