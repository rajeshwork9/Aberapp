import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import React, { useEffect, useState, useRef } from 'react';
import { getCases, getCasesStatus } from '../services/common'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Image,
    FlatList,
    RefreshControl,
} from 'react-native';
import {
    Text,
    Card,
    TextInput,
    Modal,
    Portal,
    PaperProvider,
    Button,
    ActivityIndicator,
} from 'react-native-paper';
import { useAccount } from '../context/AccountProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


interface Cases {
  CustomerId: number;
  CaseId: number;
  AccountId: number;
  CaseType: string;
  ShortDescription: string;
  CreationDate: string;
  CommitedDate: string;
  ResponsibleArea: string;
  StatusId: number;
}

const Cases: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { full } = useAccount();

    const statusColors: Record<number, string> = {
    2: '#808080',  // Closed - Gray
    4: '#FFA500',  // Pending - Orange
    5: '#28A745',  // Active - Green
    6: '#17A2B8',  // In Progress - Blue
    7: '#b394ecff',  // Assigned - Purple
    8: '#FFC107',  // Reopened - Amber
    9: '#DC3545',  // Escalated - Red
    };


    const [search, setSearch] = useState('');
    const [accountDetails, setAccountDetails] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [casesData, setCasesData] = useState<Cases[]>([]);
    const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day').toDate());
    const [toDate, setToDate] = useState(new Date());
    const [caseStatusData, setCaseStatusData] = useState<any[]>([]);

    useEffect(() => {
        setAccountDetails(full);
    }, [full]);

    useEffect(() => {
        if (accountDetails) {
            getCasesData(accountDetails.AccountId, 1, true);
            getCaseStatusData();
        }
    }, [accountDetails]);


    const getCasesData = async (accountId: number, pageNumber: number, isRefresh = false, fromDateParam?: Date, toDateParam?: Date) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            const DAYS_BACK = 7; // or any number of days you want
            const fromDatetime = dayjs(fromDateParam || dayjs().subtract(7, 'day').toDate())
                .startOf('day')
                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');           
                // THH:mm:ss[Z]   
            const toDatetime = dayjs(toDateParam || new Date())
                .utc()
                .subtract(1, 'minute')
                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            const payload =
              {
            accountId:accountId,
            fromDate: fromDatetime,
            toDate: toDatetime,
            PageNumber: pageNumber,
            PageSize: 5
            // {
            //     "accountId": 7,
            //     "GantryId": 0,
            //     "fromDate": "2021-05-12",
            //     "toDate": "2025-06-17",
            //     "PageNumber": 1,
            //     "PageSize": 5
            }
            console.log(payload, "payload");


            const response = await getCases(payload);
            console.log(response, "rsponse");

            const newList = response || [];

            setTotalRows(response.TotalRows || 0);
            setPage(pageNumber);

            setCasesData(prev => isRefresh || pageNumber === 1 ? newList : [...prev, ...newList]);
        } catch (e) {
            console.error('Trips fetch error:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

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

    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path);
    };

    return (
        <PaperProvider>
                    <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">

            <View style={styles.container}>
                
                {/* header section */}
                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock}>
                        <TouchableOpacity style={[styles.backBt, { marginRight: 12 }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Cases</Text>
                    </View>

                    <View style={styles.headerRightBlock}>
                        <TouchableOpacity style={[styles.btHeader, { marginRight: 12 }]} onPress={() => navigateTo('AddCases')}>
                            <Text style={styles.btHeaderText}>Add Cases</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.roundedIconBt}>
                            <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* End Header */}

                <FlatList
                    data={casesData}
                    keyExtractor={(item, index) => `${item.CaseId}-${index}`}
                    contentContainerStyle={styles.container}
                    ListHeaderComponent={
                        <View style={styles.searchBlock}>
                            <TextInput
                                style={styles.searchFormInput}
                                placeholder='search'
                                value={search}
                                onChangeText={setSearch}
                                mode='outlined'
                                theme={{ roundness: 100, colors: { text: '#000', primary: '#000', background: '#fff' } }}
                            />
                            <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} />
                        </View>
                    }
                    renderItem={({ item }) => (

                        <Card style={styles.cardItemMain}>
                            <View style={styles.cardContentInner}>
                                <View style={styles.leftCardCont}>
                                    <Card style={styles.cardWithIcon}>
                                        <Image style={styles.cardIconImg} source={require('../../assets/images/cases-icon.png')} />
                                    </Card>
                                    <View style={styles.leftTextCard}>
                                        <Text style={styles.textCard}>Registration Center</Text>
                                        <Text style={styles.textCard}>Case ID : {item.CaseId} </Text>
                                        <Text style={styles.textCard}>Case Type : {item.CaseType}</Text>
                                        <Text style={styles.textCard}>Description : {item.ShortDescription}</Text>
                                        <Text style={[styles.textCard, { fontWeight: 'light' }]}>{item.CreationDate  }</Text>
                                    </View>
                                </View>
                                <View style={styles.rightTextCard}>
                                    <Text style={styles.statusTextCard}>
                                        <Text style={[styles.activeText, { fontWeight: 'normal', color: statusColors[item.StatusId] || '#000' }]}>{caseStatusData.find((data: any)=> data.ItemId == item.StatusId)?.ItemName} </Text>
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    )}
                    onEndReached={() => {
                        if (!loading && casesData.length < totalRows) {
                            getCasesData(accountDetails.AccountId, page + 1, false,fromDate, toDate);
                        }
                    }}
                    onEndReachedThreshold={0.3}
                    refreshing={refreshing}
                    onRefresh={() => getCasesData(accountDetails.AccountId, 1,false, fromDate, toDate)}
                    ListFooterComponent={
                        loading && !refreshing ? (
                            <View style={{ paddingVertical: 20 }}>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : casesData.length >= totalRows ? (
                            <View style={{ paddingVertical: 20 }}>
                                <Text style={{ textAlign: 'center', color: '#aaa' }}>No more data to load</Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        </ImageBackground>
        </PaperProvider>

    );
};

export default Cases;

const styles = StyleSheet.create({

    //--- Header
    backgroundImage: {
        flex: 1,

    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff'
    },
    container: {
        flex: 1,
        marginHorizontal: 8,
        marginTop: 20,
        paddingBottom: 40,
    },

    headerMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 0,
        backgroundColor: 'transparent',
        marginTop: 15,


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

    searchBlock: {
        marginTop: 0,
        marginHorizontal: 5,
        marginBottom: 15,
        height: 50,

    },

    searchFormInput: {
        height: 44,
        borderColor: '#fff',
        borderRadius: 100,
        paddingRight: 20,
        paddingLeft: 25,
        marginTop: 0,
        fontSize: 15,
        fontWeight: 400,
        color: '#000',
        backgroundColor: '#fff'


    },

    formInputIcon: {
        width: 16,
        height: 16,
        position: 'absolute',
        top: 15,
        left: 14,
    },

    //--- Header End

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
        flexDirection: 'row', alignItems: 'flex-start',
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
        marginTop: 0,
    },
    activeText: {
        color: '#06F547',
    },
    inprogsText: {
        color: '#007AFF',
    },
});