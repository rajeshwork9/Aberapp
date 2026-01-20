import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MainStackParamList } from '../../App';
import dayjs from 'dayjs';
import { getOverallClasses, getAssetStatus } from '../services/common';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


type VehicleDetailsRouteProp = RouteProp<MainStackParamList, 'VehicleDetails'>;

const VehicleDetails: React.FC = () => {
    const route = useRoute<VehicleDetailsRouteProp>();
    const vehicleDetails = route.params.state;
    const grams = vehicleDetails.Vehicle?.UnloadedWeight || 0;
    const kilograms = grams / 1000;
    const navigation = useNavigation();

    const [typesData, setTypesData] = useState<any[]>([]);
    const [assetStatus, setAssetStatus] = useState<any[]>([]);

    useEffect(()=>{
        getTypes();
        getStatus();
    },[])

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

    const getStatus = async () => {
        try {
            const response = await getAssetStatus();
            console.log(response);
            setAssetStatus(response);
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
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={[{ marginRight: 12, }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Vehicle Details</Text>
                    </View>
                </View>
                <View style={styles.containerInner}>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>License Plate Number</Text>
                        <Text style={styles.LabelValue}> {vehicleDetails.AssetIdentifier ? vehicleDetails.AssetIdentifier : '-'} </Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Make/Model</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.Vehicle?.Make ? vehicleDetails.Vehicle?.Make : '-'}/{vehicleDetails.Vehicle?.Model ? vehicleDetails.Vehicle?.Model : '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Linked With</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.RelatedAssetIdentifier ? vehicleDetails.RelatedAssetIdentifier : '-'}</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>State</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.Vehicle?.State ? vehicleDetails.Vehicle?.State : '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Country</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.Vehicle?.CountryCode ? vehicleDetails.Vehicle?.CountryCode : '-'}</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Year</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.Vehicle?.Year ? vehicleDetails.Vehicle?.Year : '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Class</Text>
                        <Text style={styles.LabelValue}>{String(typesData.find((data: any) => vehicleDetails.OverallClassId == data.ItemId)?.ItemName ?? '-')}</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>License Plate Type</Text>
                        <Text style={styles.LabelValue}>-</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Metalized Windshield</Text>
                        <Text style={styles.LabelValue}>-</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Color</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.Vehicle?.Color ? vehicleDetails.Vehicle?.Color :'-'}</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Valid From</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.ValidFromDate ? dayjs(vehicleDetails.ValidFromDate).format('DD MMM YYYY') : '-'}</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Valid To</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.ValidToDate ? dayjs(vehicleDetails.ValidToDate).format('DD MMM YYYY') : '-'}</Text>
                        </View>    
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>UW(Kg)</Text>
                        <Text style={styles.LabelValue}>{vehicleDetails.Vehicle?.UnloadedWeight}</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Status</Text>
                        <Text style={styles.LabelValue}>{assetStatus.find((data: any) =>vehicleDetails.StatusId == data.ItemId)?.ItemName ?? '--' }</Text>
                        </View>    
                    </View>
                   
                   
   
                </View>
                
            </View>
            </SafeAreaView>
        </ImageBackground>

    );
};
export default VehicleDetails;

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
    marginBottom:25
    },
    leftDiv:{
         width: '55%',
    },
    LabelText: {
        fontSize: 12,
        color: '#fff',
        paddingVertical:4
    },
    LabelValue:{
        fontSize: 13,
        color: '#fff',
        fontWeight:'bold'
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

   
});