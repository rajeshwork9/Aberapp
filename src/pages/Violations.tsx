import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image, FlatList } from 'react-native';
import { Text, Card, TextInput, Modal, Portal, PaperProvider, Button, ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { getViolations, getOverallClasses, getTransactionStatus } from '../services/common';
import { useAccount } from '../context/AccountProvider';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const Violations: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const containerStyle = { backgroundColor: 'white', padding: 100 };
    const { full } = useAccount();

    const statusColors: Record<number, string> = {
    2: '#808080',  // Closed - Gray
    1: '#FFA500',  // Pending - Orange
    3: '#28A745',  // Active - Green
    17: '#17A2B8',  // In Progress - Blue
    100: '#b394ecff',  // Assigned - Purple
    101: '#FFC107',  // Reopened - Amber
    102: '#DC3545',  // Escalated - Red
    };
    const [search, setSearch] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [accountDetails, setAccountDetails] = useState<any>();
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [violationData, setViolationData] = useState<any>();
    const [value, setValue] = useState(null);
    const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day').toDate());
    const [toDate, setToDate] = useState(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [statusData, setStatusData] = useState<any[]>([]);



    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        setAccountDetails(full);
    }, [full]);

    useEffect(() => {
        if (accountDetails) {
            getViolationsData(accountDetails.AccountId, 1, true);
            getTransactionStatusData();
        }
    }, [accountDetails]);

    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path)
    }

    const getViolationsData = async (accountId: number, pageNumber: number, isRefresh = false, fromDate?: Date, toDate?: Date) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            const DAYS_BACK = 7; // or any number of days you want
            const fromDatetime = dayjs(fromDate || dayjs().subtract(7, 'day').toDate())
                .startOf('day')
                .format('YYYY-MM-DDTHH:mm:ss[Z]');
            const toDatetime = dayjs(toDate || new Date())
                .endOf('day')
                .format('YYYY-MM-DDTHH:mm:ss[Z]');
            let payload = {
                "accountId": accountId,
                "AccountUnitId": 0,
                "GantryId": 0,
                "fromDate": fromDatetime,
                "toDate": toDatetime,
                "PageNumber": pageNumber,
                "PageSize": 10
            }
            console.log(payload);
            const response = await getViolations(payload);
            console.log('violation response', response);
            const PAGE_SIZE = 10;
            const newList = response || [];
           
            if (isRefresh || pageNumber === 1) {
                setViolationData(newList);
            } else {
                setViolationData((prev: any) => [...prev, ...newList]);
            }

            // Only increase page if data was returned
            setHasMoreData(newList.length === PAGE_SIZE);
            setPage(pageNumber);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleClearFilter = () => {
        setFilterEnabled(false);
        getViolationsData(accountDetails.AccountId, 1, true, dayjs().subtract(7, 'day').toDate(), new Date());
    }

    const getTypes =  async ()   => {
        try {
            const response = await  getOverallClasses();
            console.log(response);
        }
        catch (error: any){
            console.error(error);
        }
        finally {
            console.log('api comopleted');
            
        }
    };
    
    const getTransactionStatusData =  async ()   => {
        try {
            const response = await  getTransactionStatus();
            console.log(response);
            setStatusData(response);
        }
        catch (error: any){
            console.error(error);
        }
        finally {
            console.log('api comopleted');
            
        }
    } 

    return (
        <PaperProvider>
            <ImageBackground
                source={require('../../assets/images/background.png')}
                style={styles.backgroundImage}
                resizeMode="cover">

                <View style={{ flex: 1 }}>

                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={[styles.backBt, { marginRight: 12, }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Violations</Text>
                    </View>

                    <View style={styles.headerRightBlock}>
                        <TouchableOpacity style={styles.roundedIconBt} onPress={() => showModal()}>
                            <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                        </TouchableOpacity>
                        <View style={styles.btHeader}>
                            {filterEnabled && (
                                <Button onPress={handleClearFilter} labelStyle={styles.filterText}>
                                    Clear Filter
                                </Button>
                            )}
                        </View>

                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBottomContainer}>

                                <Text style={styles.sectionTitleModal}>Violation Filters</Text>
                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>From Date</Text>
                                    <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.selectDropdown}>
                                        <Text style={styles.selectedTextStyle}>{dayjs(fromDate).format('YYYY-MM-DD')}</Text>
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

                                {/* To Date Picker */}
                                <View style={styles.formGroupModal}>
                                    <Text style={styles.labelModal}>To Date</Text>
                                    <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.selectDropdown}>
                                        <Text style={styles.selectedTextStyle}>{dayjs(toDate).format('YYYY-MM-DD')}</Text>
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

                                <View style={styles.buttonRow}>
                                    <Button
                                        mode="contained"
                                        onPress={hideModal}
                                        style={styles.closeButton}
                                        textColor="#000"
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        mode="contained"
                                        onPress={() => {
                                            hideModal();
                                            if (accountDetails?.AccountId) {
                                                getViolationsData(accountDetails.AccountId, 1, true, fromDate, toDate);
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

                    <FlatList
                        data={violationData}
                        keyExtractor={(item, index) => `${item.AccountId}-${index}`}
                        contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
                        ListHeaderComponent={
                            <View style={styles.searchBlock}>
                                <TextInput
                                    style={styles.searchFormInput}
                                    placeholder="Search"
                                    value={search}
                                    onChangeText={setSearch}
                                    mode="outlined"
                                    theme={{ roundness: 100, colors: { text: '#000', primary: '#000', background: '#fff' } }}
                                />
                                <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} />
                            </View>
                        }
                        renderItem={({ item }) => (
                            <Card style={styles.cardItemMain} onPress={() => navigation.navigate('ViolationsDetails')}>
                                <View style={styles.cardContentInner}>
                                    <View style={styles.leftCardCont}>
                                        <Card style={styles.cardWithIcon}>
                                            <Image style={styles.cardIconImg} source={require('../../assets/images/vehicles-icon.png')} />
                                        </Card>
                                        <View style={styles.leftTextCard}>
                                            <Text style={styles.textCard}>{item.VRM}</Text>
                                            <Text style={styles.textCard}>{item.LocationName}</Text>
                                            <Text style={styles.textCard}>Transaction ID: {item.TransactionId}</Text>
                                            <Text style={styles.textCard}>{dayjs(item.TransactionDate).format('YYYY-MM-DD HH:mm')}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.rightTextCard}>
                                        <Text style={styles.statusTextCard}>
                                            <Text style={[styles.statusText, { fontWeight: 'normal',color: statusColors[item.StatusId] }]}> {statusData.find((data : any)=> item.StatusId == data.ItemId)?.ItemName} : </Text>
                                            <Text style={[styles.statusText, { fontWeight: 'bold', color: statusColors[item.StatusId] }]}>{item.AmountFinal}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        )}
                        onEndReached={() => {
                            console.log("Reached end, loading more...");
                            if (!loading && hasMoreData) {
                                getViolationsData(accountDetails.AccountId, page + 1, false,  fromDate, toDate);
                            }
                        }}
                        onEndReachedThreshold={0.1}
                        refreshing={refreshing}
                        onRefresh={() => getViolationsData(accountDetails.AccountId, 1, true, fromDate, toDate)}
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
export default Violations;
const styles = StyleSheet.create({

    //--- Header
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    container: {
       
        marginHorizontal: 10,
        marginTop: 20,
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
    backBt: {},
    headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start', },
    headerRightBlock: { flexDirection: 'row', justifyContent: 'flex-end', },
    headerIcon: { width: 18, height: 18, },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },


    btHeader: {
        marginLeft: 0,
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
        // width:'55%',
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

    smallLabel: {
        fontSize: 12,
        color: '#A29F9F',
        marginTop: 8,
    },

    smallTextCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
    },

    deateCard: {
        fontSize: 10,
        color: '#fff',
        paddingTop: 1,

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
        fontSize: 11,
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


    // --
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
        paddingHorizontal: 0,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    labelModal: { color: '#fff', fontSize: 13, marginBottom: 10, },

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


    selectDropdown: {
        width: '100%',
        marginHorizontal: 0,
        height: 50,
        backgroundColor: '#000000',
        borderRadius: 0,
        color: '#fff',
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderWidth: 1,
        borderBottomColor: '#fff',
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

    dropdownList: {
        backgroundColor: '#222',
        borderColor: '#222',
        borderRadius: 4,
        paddingVertical: 6,



    },

    listSelectGroup: {
        backgroundColor: '#222',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    itemTextSelect: {
        backgroundColor: 'transparent',
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



    //---
    primaryBt: {
        color: '#fff',
        borderRadius: 40,
        marginTop: 0,
        paddingHorizontal: 7,
        paddingVertical: 5,
        backgroundColor: '#FF5400',
    },
    textPrimaryBt: {
        color: '#fff',
        fontSize: 12,
    },






});