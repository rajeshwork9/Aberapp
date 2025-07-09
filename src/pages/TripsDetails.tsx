import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, Portal, PaperProvider, Button, IconButton  } from 'react-native-paper';
import { Animated} from 'react-native';

const TripsDetails: React.FC = () => {
    const navigation = useNavigation();

    // modal popup useset
   const [visible, setVisible] = React.useState(false);
       const showModal = () => setVisible(true);
       const hideModal = () => setVisible(false);

    // loading animation code
// const rotateAnim = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 3,
//         duration: 1700,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const spin = rotateAnim.interpolate({
//     inputRange: [0, 2],
//     outputRange: ['0deg', '360deg'],
//   });

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
                        <Text style={styles.LabelText}>Identifier sfsdfds</Text>
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
                   
                    <Button mode="contained" style={styles.orangeButton} onPress={() => showModal()}>
                    <Image style={{ width: 16, height: 16, }}  source={require('../../assets/images/chat-icon.png')}/> Dispute Trip
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
        marginHorizontal: 10,
        marginTop: 10,

    },
     containerInner: {
        marginHorizontal: 20,
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
        height:50

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
        paddingHorizontal:0,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 10, },

        calendarInputModal:{
         paddingHorizontal:40,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    calendarIcon:{position:'absolute', left:5, bottom:11, width:20, height:20,},

    
     selectDropdown: {
        width: '100%',
        marginHorizontal: 0,
        height:40,
        backgroundColor: '#000000',
        borderRadius: 0,
        color: '#fff',
        paddingHorizontal:0,
        paddingVertical:0,
        borderWidth:1,
        borderBottomColor:'#fff',
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

    dropdownList : {       
       backgroundColor:'#222',
        borderColor: '#222',
        borderRadius: 4,
         paddingVertical:6,

        
        
    },

    listSelectGroup:{backgroundColor:'#222', 
        paddingVertical:10,
        paddingHorizontal:15,
    },
    itemTextSelect:{
        backgroundColor:'transparent',
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
});