import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, Image } from 'react-native';
import { Button, Text, Badge, Avatar, Card, IconButton } from 'react-native-paper';


const Topup: React.FC = () => {
    const [country, setCountry] = useState('1');
    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">

            <ScrollView style={styles.container}>
                <View style={styles.balanceCard}>
                    <Image style={styles.imgWalletBalance} source={require('../../assets/images/wallet-icon.png')} />
                    <Card style={styles.balanceContent}>
                        <Text style={styles.balanceLabel}>1,345.00</Text>
                        <Text style={styles.textBalance}>Available Balance (AED)</Text>
                    </Card>
                </View>

                <View style={styles.bottomCard}>
                    <Text>Add money to wallet</Text>
                    <Text>Amount in AED</Text>
                </View>

            </ScrollView >
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
        marginHorizontal: 10,
        marginTop: 30,
        height:'100%',
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
        marginTop: 4, fontSize: 22, fontWeight: 'bold', textAlign: 'left', color: '#fff',
    },
    textBalance: {
        fontSize: 8, color: '#fff',
    },

    imgWalletBalance: {
        width: 40,
        height: 40,
        tintColor: 'white'
    },

    bottomCard:{
      backgroundColor:'#000',
      borderRadius:20,
      position:'absolute',
      bottom:0,  
    }

});