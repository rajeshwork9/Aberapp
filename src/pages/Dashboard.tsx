import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Button, Text, Badge, Avatar, Card, ActivityIndicator } from 'react-native-paper';
import { SelectCountry } from 'react-native-element-dropdown';
import { useNavigation, useIsFocused  } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../App';
import { useAccount } from '../context/AccountProvider';
import { Animated } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Splash from './Splash';
import Loader from '../components/Loader';
import { getTodaysTrips, getOverallClasses, getLicenceNumber } from '../services/common';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // adjust based on path



const local_data = [
    {
        value: '1',
        lable: 'EN',
        image: {
            uri: 'http://rpdemos.net/clients/4xmsol/assets/images/us.png',
        },
    },
    {
        value: '2',
        lable: 'AE',
        image: {
            uri: 'http://rpdemos.net/clients/4xmsol/assets/images/ar.png',
        },
    },
];

interface LPN {
    label: string;
    value: string;
    AssetIdentifier: string;
    OverallClassId: number;
}

const Dashboard: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { full, loadingFull } = useAccount();

    const [country, setCountry] = useState('1');
    const [accountDetails, setAccountDetails] = useState<any>();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [todaysTripsData, setTodaysTripsData] = useState<any>();
    const [lpnData, setLpnData] = useState<LPN[] | any>([]);
    const [typesData, setTypesData] = useState<any[]>([]);


    const { t } = useTranslation();
    const isFocused = useIsFocused();


    useEffect(() => {
        setAccountDetails(full);
    }, [full]);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('accessToken');
            const expiry = await AsyncStorage.getItem('tokenExpiry');
            const refresh = await AsyncStorage.getItem('refreshToken');
            console.log('[TOKEN CHECK]', { token, expiry, refresh });
        })();
    }, []);

    useEffect(() => {
        if (loadingFull) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [loadingFull]);

    useEffect(() => {
        if (accountDetails) {
            todaysTrips(accountDetails.AccountId);
            licenceNumber(accountDetails.AccountId);
            getTypes();
        }
    }, [accountDetails]);

    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path);
    };

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLang = await AsyncStorage.getItem('appLanguage');
            if (savedLang) {
                setCountry(savedLang === 'ar' ? '2' : '1');
                await i18n.changeLanguage(savedLang);
            }
        };
        loadLanguage();
    }, []);

    useEffect(() => {
  if (isFocused) {
    console.log("focused");
    
    const updateLanguage = async () => {
   
      const lang = await AsyncStorage.getItem('appLanguage');
      console.log(lang,"1");
      console.log(i18n.language,"2")
      setCountry(lang === 'ar' ? '2' : '1');
      if (lang && i18n.language !== lang) {
        await i18n.changeLanguage(lang);
      }
    };
    updateLanguage();
  }
}, [isFocused]);


    const todaysTrips = async (accountId: number) => {
        try {
            const DAYS_BACK = 7; // or any number of days you want
            const fromDatetime = dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
            const toDatetime = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
            let payload =
            {
                "accountId": accountId,
                "AccountUnitId": 0,
                "GantryId": 0,
                "fromDate": fromDatetime,
                "toDate": toDatetime,
                "PageNumber": 1,
                "PageSize": 5
            }
            console.log(payload, 'fegrq');

            const response = await getTodaysTrips(payload);
            console.log('Todays Trips Response', response);
            setTodaysTripsData(response.TransactionsList);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            console.log('Api call completed');
        }
    };

    const changeLanguage = async (lang: 'en' | 'ar') => {
        await AsyncStorage.setItem('appLanguage', lang);
        await i18n.changeLanguage(lang);
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
    };

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

    const getClassNameFromVRM = (vrm: string) => {
        const lpnMatch = lpnData.find((d: any) => d.AssetIdentifier === vrm);
        if (!lpnMatch) return '—';
        const classId = lpnMatch.OverallClassId;
        const className = typesData.find((t: any) => t.ItemId === classId)?.ItemName;
        return className ?? '—';
    };

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            {!accountDetails ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <Loader fullScreen={false} />
                </View>
            ) : (<ScrollView>
                <View style={styles.container}>
                    <View style={styles.headerDashRow}>
                        <TouchableOpacity style={styles.profileCont} onPress={() => navigateTo('Profile')}>
                            <Avatar.Icon size={28} style={styles.avatarIcon} icon="account" />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}> {accountDetails.AccountName}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <SelectCountry
                            style={styles.countryDropdown}
                            selectedTextStyle={styles.selectedTextContry}
                            placeholderStyle={styles.placeholderCountry}
                            imageStyle={styles.imageCountry}
                            // inputSearchStyle={styles.inputSearchCountry}
                            iconStyle={styles.iconCountry}
                            // search
                            maxHeight={200}
                            value={country}
                            data={local_data}
                            valueField="value"
                            labelField="lable"
                            imageField="image"
                            placeholder="Select country"
                            containerStyle={styles.dropdownList}
                            activeColor="#333333"
                            // searchPlaceholder="Search..."
                            onChange={async e => {
                                setCountry(e.value);
                                const lang = e.value === '2' ? 'ar' : 'en';
                                await changeLanguage(lang);
                            }}
                        />

                        <View style={styles.notification}>
                            <Badge size={19} style={styles.badgeNotifi}>4</Badge>
                            <Image style={styles.imgNotifi} source={require('../../assets/images/notification-icon.png')} />
                            {/* <Button onPress={() => handleLogout()} mode="contained" style={styles.topupBtn} labelStyle={{ fontSize: 12 }}
                        >Logout</Button> */}
                        </View>
                    </View>

                    <View style={styles.balanceCard}>
                        <View style={styles.leftDiv}>
                            <Image style={styles.imgWalletBalance} source={require('../../assets/images/wallet-icon.png')} />
                            <Card style={styles.balanceContent}>
                                <Text style={styles.balanceLabel}>{accountDetails?.Balance ? new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(accountDetails.Balance)
                                    : '0.00'}</Text>
                                <Text style={styles.textBalance}> {t('dashboard.available_balance')} (AED)</Text>
                            </Card>
                        </View>
                        <View style={styles.rightDiv}>
                            <Button onPress={() => navigateTo('Topup')} mode="contained" style={styles.topupBtn} labelStyle={{ fontSize: 12 }}
                            >{t('dashboard.top_up')}</Button>
                        </View>
                    </View>



                    <View style={styles.iconGrid}>
                        <View style={styles.iconItem}>
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('Vehicles')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/vehicles-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.vehicles')}</Text>
                        </View>

                        <View style={styles.iconItem}>
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('Trips')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/trips-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.trips')}</Text>
                        </View>

                        <View style={styles.iconItem}>
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('Violations')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/violations-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.violations')}</Text>
                        </View>

                        <View style={styles.iconItem}>
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('Cases')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/cases-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.cases')}</Text>
                        </View>

                        <View style={styles.iconItem}>
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('Statements')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/statements-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.statements')}</Text>
                        </View>

                        <View style={styles.iconItem} >
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('DashboardPage')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/dashboard-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.dashboard')}</Text>
                        </View>

                        <View style={styles.iconItem}>
                            <Card style={styles.imgGridItem} onPress={() => navigateTo('TransactionHistory')}>
                                <Image style={styles.imgGItem} source={require('../../assets/images/transaction-history-icon.png')} />
                            </Card>
                            <Text style={styles.iconLabel}>{t('dashboard.transaction_history')}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.sectionTitle}>{t('dashboard.todays_trips')}</Text>
                        {todaysTripsData && todaysTripsData.length > 0 ? (
                            todaysTripsData.map((data: any, index: number) => (
                                <Card key={index} style={styles.cardItemMain}>
                                    <View style={styles.cardContentInner}>

                                        <View style={styles.leftCardCont}>
                                            <Card style={styles.cardWithIcon}>
                                                <Image style={styles.cardIconImg} source={require('../../assets/images/trips-icon.png')} />
                                            </Card>

                                            <View style={styles.leftTextCard}>
                                                <Text style={styles.textCard}>{data.VRM}</Text>
                                                <Text style={styles.textCard}>{data.LocationName}</Text>
                                                <Text style={styles.textCard}>Transaction ID : {data.TransactionId}</Text>
                                                <Text style={[styles.textCard, { fontWeight: 'light' }]}>{data.TransactionDate}</Text>
                                            </View>

                                        </View>
                                        <View style={styles.rightTextCard}>
                                            <Text style={styles.largeTextRCard}>{getClassNameFromVRM(data.VRM)}</Text>
                                            <Image style={{ width: 16, height: 16, marginVertical: 4, }} source={require('../../assets/images/chat-icon.png')} />

                                            <Text style={styles.statusTextCard}>
                                                <Text style={[styles.statusText, { fontWeight: 'normal' }]}>Paid: </Text>
                                                <Text style={[styles.statusText, { fontWeight: 'bold' }]}>{data.AmountFinal}</Text>
                                            </Text>
                                            {/* <Text style={{ color: index === 0 ? 'green' : 'red' }}>
                                                {index === 0 ? 'Paid : 300' : 'Unpaid : 300'}
                                                </Text> */
                                            }
                                        </View>
                                    </View>
                                </Card>
                            ))

                        ) :
                            (
                                <Card style={styles.cardItemMain}>
                                    <Text style={styles.noTripsText}>{t('dashboard.no_trip_found')}</Text>
                                    <View style={styles.cardContentInner}></View>
                                </Card>
                            )}
                    </View>
                </View>


            </ScrollView >)}

            {loadingFull && accountDetails && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    pointerEvents="auto"
                >
                    {/* <BlurView
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        blurType="light" // or 'dark', 'extraLight', 'regular', 'prominent'
                        blurAmount={10}
                        reducedTransparencyFallbackColor="white"
                    /> */}

                    <ActivityIndicator size="large" color="#FF5400" />
                    <Text style={{ marginTop: 10, color: '#000' }}>Switching account...</Text>
                </View>
            )}


        </ImageBackground>
    );
};
export default Dashboard;
const styles = StyleSheet.create({
    countryDropdown: {
        width: 74,
        marginBottom: 0,
        marginHorizontal: 0,
        height: 30,
        backgroundColor: '#000000',
        borderRadius: 30,
        color: '#fff',
        paddingHorizontal: 6,
        right: -1
    },
    imageCountry: {
        width: 14,
        height: 14,
        color: '#fff',
        marginLeft: 4,
    },
    placeholderCountry: {
        fontSize: 11,
        color: '#fff',
    },
    selectedTextContry: {
        fontSize: 11,
        marginLeft: 6,
        color: '#fff',
    },
    iconCountry: {
        width: 13,
        height: 13,
        backgroundColor: '#000',
    },
    inputSearchCountry: {
        height: 40,
        fontSize: 13,
        backgroundColor: '#000',
    },
    dropdownList: {
        backgroundColor: '#000',
        color: '#fff',
        borderColor: '#000',
        borderRadius: 4,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 30,

    },

    headerDashRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        alignItems: 'center',

    },
    notification: {
        display: 'flex',
        position: 'relative',
    },
    badgeNotifi: {
        position: 'absolute',
        top: -11,
        left: 7,
        zIndex: 1,
        backgroundColor: '#E30C0C',
        fontSize: 11,
    },

    imgNotifi: {
        width: 20,
        height: 20,
    },


    profileCont: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        borderRadius: 30,
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 260,
    },
    avatarIcon: {
        marginTop: 2,
        backgroundColor: '#0FA9A6',
    },
    userInfo: { marginLeft: 9, width: 190, lineHeight: 24 },
    userName: { fontSize: 10, color: '#fff', paddingVertical: 1, lineHeight: 15, flexWrap: 'wrap', },
    badge: { position: 'absolute', right: 0, top: 0 },

    balanceCard: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 50,
        marginHorizontal: 5,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 13,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftDiv: {
        flexDirection: 'row', alignItems: 'center',
    },
    rightDiv: {

    },
    balanceContent: {
        backgroundColor: '#fff',
        marginHorizontal: 7,
        paddingHorizontal: 5,
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        shadowColor: 'transparent',
    },
    balanceLabel: {
        marginTop: 4, fontSize: 22, fontWeight: 'bold', textAlign: 'left', color: '#000',
    },
    textBalance: {
        fontSize: 10,
    },
    topupBtn: {
        width: 98,
        // right: '-21%'
    },

    imgWalletBalance: {
        width: 30,
        height: 30,
    },


    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',

        marginTop: 24,
        paddingHorizontal: 8,

    },
    iconItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        width: '33.33%',

    },
    iconLabel: {
        fontSize: 12,
        textAlign: 'center',
        color: '#fff',
        marginVertical: 6,
    },
    imgGridItem: {
        width: 64,
        height: 64,
        backgroundColor: '#fff',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    imgGItem: {
        width: 30,
        height: 30,
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
        width: 30,
        height: 30,
        tintColor: 'white'
    },

    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',

        width: '71%',
    },

    leftTextCard: {


    },

    textCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
        flexDirection: 'column',

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
    noTripsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    }



});