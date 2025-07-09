import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, PaperProvider, Button, IconButton  } from 'react-native-paper';
import { Animated} from 'react-native';

const VehicleDetails: React.FC = () => {
    const navigation = useNavigation();

//     // modal popup useset
//    const [visible, setVisible] = React.useState(false);
//        const showModal = () => setVisible(true);
//        const hideModal = () => setVisible(false);


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
                        <Text style={styles.headerTitle}>Vehicle Details</Text>
                    </View>
                </View>
                <View style={styles.containerInner}>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Identifier</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_a</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Date & Time</Text>
                        <Text style={styles.LabelValue}>2025/01/03, 09:27 AM</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>Trip ID</Text>
                        <Text style={styles.LabelValue}>1234567</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>Entry Location</Text>
                        <Text style={styles.LabelValue}>G3 - AL Kadrah</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                        <View>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                    </View>
                    <View style={styles.Box}>
                        <View style={styles.leftDiv}>
                        <Text style={styles.LabelText}>36487-AE-UQ-PRI_A</Text>
                        <Text style={styles.LabelValue}>36487-AE-UQ-PRI_A</Text>
                        </View>
                        
                    </View>
                   
                   
   
                </View>
                
            </View>
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

    container: {
        flex: 1,
        marginHorizontal: 10,
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
        marginTop: 12,
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