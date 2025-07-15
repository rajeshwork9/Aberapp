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
    IconButton,
    ActivityIndicator,
    Checkbox,
} from 'react-native-paper';
import { useAccount } from '../context/AccountProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


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
    const [page, setPage] = useState(1);
    const [casesData, setCasesData] = useState<Cases[]>([]);
    const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day').toDate());
    const [toDate, setToDate] = useState(new Date());
    const [caseStatusData, setCaseStatusData] = useState<any[]>([]);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [activeValue, setActiveValue] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [filterEnabled, setFilterEnabled] = useState(false);
    
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
                accountId: accountId,
                fromDate: fromDatetime,
                toDate: toDatetime,
                PageNumber: pageNumber,
                PageSize: 7,
                onlyActive: activeValue
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
            const PAGE_SIZE = 7;

            const newList = response || [];
            if (isRefresh || pageNumber === 1) {
                setCasesData(newList);
            } else {
                setCasesData((prev: any) => [...prev, ...newList]);
            }

            setHasMoreData(newList.length === PAGE_SIZE);

            setPage(pageNumber);

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
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path);
    };

    const handleClearFilter = () => {
        const defaultFrom = dayjs().subtract(7, 'day').toDate();
        const defaultTo = new Date();
        setFromDate(defaultFrom);
        setToDate(defaultTo);
        setActiveValue(false);
        getCasesData(accountDetails.AccountId, 1, true, defaultFrom, defaultTo);
        setFilterEnabled(false);
    }

    return (
        <PaperProvider>
            <ImageBackground
                source={require('../../assets/images/background.png')}
                style={styles.backgroundImage}
                resizeMode="cover">

                <View style={{ flex: 1 }}>

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

                            <TouchableOpacity style={styles.roundedIconBt} onPress={showModal}>
                                <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                            </TouchableOpacity>
                            <View>
                                {filterEnabled && (
                                    <Button onPress={handleClearFilter} labelStyle={styles.filterText}>
                                        Clear Filter
                                    </Button>
                                )}
                            </View>
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
                                    <Text style={styles.sectionTitleModal}>Cases Filter</Text>

                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>From Date</Text>
                                        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.selectDropdown}>
                                            <Text style={styles.selectedTextStyle}>{dayjs(fromDate).format('DD-MM-YYYY')}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <DateTimePickerModal
                                        isVisible={showFromPicker}
                                        mode="date"
                                        date={fromDate}
                                        maximumDate={new Date()}
                                        onConfirm={(date) => {
                                            setShowFromPicker(false);
                                            setFromDate(date);
                                        }}
                                        onCancel={() => setShowFromPicker(false)}
                                    />

                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>To Date</Text>
                                        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.selectDropdown}>
                                            <Text style={styles.selectedTextStyle}>{dayjs(toDate).format('DD-MM-YYYY')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={showToPicker}
                                        mode="date"
                                        date={toDate}
                                        maximumDate={new Date()}
                                        onConfirm={(date) => {
                                            setShowToPicker(false);
                                            setToDate(date);
                                        }}
                                        onCancel={() => setShowToPicker(false)}
                                    />

                                    <View style={styles.cboxStyle}>
                                        <Checkbox
                                            color="#fff"
                                            uncheckedColor="#fff"
                                            status={activeValue ? 'checked' : 'unchecked'}
                                            onPress={() => setActiveValue(!activeValue)}
                                        />
                                        <Text style={styles.cboxlabel}>Only Active</Text>
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <Button
                                            mode="contained"
                                            onPress={() => {
                                                hideModal();
                                                if (accountDetails?.AccountId) {
                                                    getCasesData(accountDetails.AccountId, 1, true, fromDate, toDate);
                                                    setFilterEnabled(true);
                                                }
                                            }}
                                            buttonColor="#FF5A00"
                                            style={styles.applyButton}
                                        >
                                            Apply
                                        </Button>
                                    </View>
                                </Modal>
                            </Portal>
                        </View>
                    </View>
                    {/* End Header */}

                    <FlatList
                        data={casesData}
                        keyExtractor={(item, index) => `${item.CaseId}-${index}`}
                        contentContainerStyle={[styles.container]}
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
                        showsVerticalScrollIndicator={true}
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
                                            <Text style={[styles.textCard, { fontWeight: 'light' }]}>{item.CreationDate}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.rightTextCard}>
                                        <Text style={styles.statusTextCard}>
                                            <Text style={[styles.activeText, { fontWeight: 'normal', color: statusColors[item.StatusId] || '#000' }]}>{caseStatusData.find((data: any) => data.ItemId == item.StatusId)?.ItemName} </Text>
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        )}
                        onEndReached={() => {
                            if (!loading && hasMoreData) {
                                getCasesData(accountDetails.AccountId, page + 1, false, fromDate, toDate);
                            }
                        }}
                        onEndReachedThreshold={0.3}
                        refreshing={refreshing}
                        onRefresh={() => getCasesData(accountDetails.AccountId, 1, true, fromDate, toDate)}
                        ListFooterComponent={
                            loading && !refreshing ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            ) : !hasMoreData ? (
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

        marginHorizontal: 8,
        marginTop: 10,
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
    headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start', marginTop:-6 },
    headerRightBlock: { flexDirection: 'row', justifyContent: 'flex-end', marginTop:2 },
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
    sectionTitleModal: {
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },

    formGroupModal: { marginTop: 10, marginBottom: 15, },
    inputModal: {
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 10, },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

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
    calendarIcon: { position: 'absolute', left: 5, bottom: 11, width: 20, height: 20, },


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
    cboxStyle: {
        position: 'relative',
        marginTop: 0,
        marginBottom: 15,
    },
    cboxlabel: {
        color: '#fff',
        position: 'absolute',
        left: 40,
        top: 7,
        fontSize: 13,
    },
  filterText: {
    color: '#000',
    fontSize: 13,
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginTop: 0
  },
  selectDropdown: {
    width: '100%',
    marginHorizontal: 0,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 0,
    color: '#fff',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 1,
    borderBottomColor: '#fff',
  },
  selectedTextStyle: {
    fontSize: 14,
    marginLeft: 6,
    color: '#fff',
  },
   modalCloseIcon: {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 10,
},

});