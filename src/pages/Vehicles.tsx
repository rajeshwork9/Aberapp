import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Modal, Portal, PaperProvider,Button } from 'react-native-paper';


const Vehicles: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle  = { backgroundColor: 'white', padding:100 };
    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <PaperProvider>
                <View style={styles.headerRightBlock}>
                    <TouchableOpacity style={[styles.btHeader, { marginRight: 12, }]}>
                        <Text style={styles.btHeaderText}>Add Vehicle</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.roundedIconBt} onPress={()=>showModal()}>
                        <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                    </TouchableOpacity>

                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle }>
                            <Text>Example Modal.  Click outside this area to dismiss.</Text>
                        </Modal>
                    </Portal>

                </View>
      
            <ScrollView style={styles.container}>

                <View>

                    <View style={styles.searchBlock}>
                        <TextInput style={styles.formInput} placeholder="Search" placeholderTextColor="#7B8994"
                            value={search} onChangeText={setSearch}
                            secureTextEntry
                        />
                        <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} ></Image>
                    </View>

                    <Card style={styles.cardItemMain}>
                        <View style={styles.cardContentInner}>
                            <View style={styles.leftCardCont}>
                                <Card style={styles.cardWithIcon}>
                                    <Image style={styles.cardIconImg} source={require('../../assets/images/vehicles-icon.png')} />
                                </Card>

                                <View style={styles.leftTextCard}>
                                    <Text style={styles.textCard}>36487-AE-UQ-PRI_A</Text>
                                    <Text style={[styles.deateCard, { fontWeight: 'light' }]}>07 Mar 2025, 10:50:01</Text>
                                </View>
                            </View>
                            <View style={styles.rightTextCard}>
                                <Text style={styles.largeTextRCard}>3XL</Text>
                                <Text style={styles.statusTextCard}>
                                    <Text style={[styles.statusText, { fontWeight: 'normal' }]}>Active</Text>

                                </Text>
                                {/* <Text style={{ color: index === 0 ? 'green' : 'red' }}>
                                    {index === 0 ? 'Paid : 300' : 'Unpaid : 300'}
                                </Text> */}
                            </View>
                        </View>
                    </Card>
                </View>




            </ScrollView >


      </PaperProvider>
        </ImageBackground>

    );
};
export default Vehicles;
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

    headerRightBlock: {
        position: 'absolute',
        right: 15,
        top: 13,
        flexDirection: 'row',
        zIndex:2,
        elevation: 10,
      },

    btHeader: {
        backgroundColor: '#ff5200',
        borderRadius: 100,
        textAlign: 'center',
        alignSelf: 'flex-start',
        paddingTop: 5,
        paddingBottom: 7,
    },
    btHeaderText: {
        color: '#fff',
        fontSize: 13,
        paddingHorizontal: 10,
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

    //---
    sectionTitle: {
        margin: 15,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'normal',
    },
    cardItemMain: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 0,
        marginHorizontal: 5,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },
    cardContentInner: {
        marginTop: 0,
        borderRadius: 50,

        paddingVertical: 10,

        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',



    },

    cardWithIcon: {
        width: 54,
        height: 54,
        backgroundColor: '#C03F00',
        borderRadius: 100,
        borderWidth: 8,
        borderColor: '#2C2C2C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0,
        elevation: 0,
        shadowColor: 'transparent',
        marginRight: 10,
        padding: 0,
    },

    cardIconImg: {
        width: 22,
        height: 22,
        tintColor: 'white'
    },
    leftTextCard: {
        // paddingRight: 10,
    },

    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '71%',
    },

    textCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
    },

    deateCard: {
        fontSize: 11,
        color: '#fff',
        paddingTop: 6,

    },
    rightTextCard: {

        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    largeTextRCard: {
        color: '#fff',
        fontSize: 16,

    },
    statusTextCard: {
        fontSize: 12,
        backgroundColor: '#000000',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 30,
        color: '#06F547',
        marginTop: 5,
    },
    statusText: {
        color: '#06F547',
        // unpaid  color: '#FF4141',

    },

    //--

    searchBlock: {
        marginHorizontal: 15,
        marginBottom: 15,

    },

    formInput: {
        height: 40,
        borderColor: '#fff',
        borderRadius: 40,
        paddingRight: 20,
        paddingLeft: 45,
        marginTop: 0,
        fontSize: 13,
        fontWeight: 400,
        color: '#000',
        backgroundColor: '#fff'
    },

    formInputIcon: {
        width: 16,
        height: 16,
        position: 'absolute',
        top: 13,
        left: 14,
    },
    modalBottomContainer: {

    },

});