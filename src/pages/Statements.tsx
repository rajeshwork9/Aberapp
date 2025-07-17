import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image, FlatList, Animated, } from 'react-native';
import { Button, TextInput, Modal, Portal, Text, Badge, Avatar, Card, IconButton, PaperProvider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useAccount } from '../context/AccountProvider';
import dayjs from 'dayjs';
import { getStatements } from '../services/common';
import RNFS from 'react-native-fs';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { ToastService } from '../utils/ToastService';
import { useTranslation } from 'react-i18next';


interface Statements {
    Amount: number,
    DocumentContent: string,
    DocumentTypeId: number,
    DueDate: string,
    FinancialDocumentID: number,
    IssueDate: string,
    OutstandingBalance: number,
    PeriodFrom: string,
    PeriodTo: string,
    ReferenceNumber: string,
    StatusId: number
}

const Statements: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const { full } = useAccount();
    const { t } = useTranslation();

    const [search, setSearch] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [accountDetails, setAccountDetails] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [statementData, setStatementData] = useState<Statements[]>([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const defaultYear = new Date().getFullYear().toString();
    const [year, setYear] = useState('2025');
    const [hasMoreData, setHasMoreData] = useState(true);
    const PAGE_SIZE = 10;
    const [visibleHeight, setVisibleHeight] = useState(1);
    const [contentHeight, setContentHeight] = useState(1)
    const scrollY = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        setAccountDetails(full);
    }, [full]);

    useEffect(() => {
        if (accountDetails) {
            getStatementsData(accountDetails.AccountId, 1, true);
        }
    }, [accountDetails]);


    const getStatementsData = async (accountId: number, pageNumber: number, isRefresh = false, overrideYear?: string) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
                setHasMoreData(true); // Reset
            } else {
                setLoading(true);
            }
            const usedYear = overrideYear || year;
            const payload = {
                AccountId: accountId,
                FinancialDocumentTypeId: 2,
                year: parseInt(usedYear),
                PageNumber: pageNumber,
                PageSize: PAGE_SIZE,
            };
            console.log(payload, "payload");

            const response = await getStatements(payload);
            console.log(response, 'statements');

            const newList = Array.isArray(response.List) ? response.List : [];

            setPage(pageNumber);
            setTotalRows(response.totalRows)
            setStatementData(prev =>
                isRefresh || pageNumber === 1 ? newList : [...prev, ...newList]
            );

            setHasMoreData(newList.length >= PAGE_SIZE); // handle edge case
        } catch (e) {
            console.error('Statements fetch error:', e);
        } finally {
            if (isRefresh) setRefreshing(false);
            setLoading(false);
        }
    };
    ;


    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const navigateTo = (path: keyof MainStackParamList) => {
        navigation.navigate(path)
    }

    const handleDownload = async (base64Data: string, filename = 'statement.pdf') => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'App needs access to your storage to download the file',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    ToastService.error('Permission Denied', 'Storage permission is required to download the file.');
                    return;
                }
            }

            const path = `${RNFS.DownloadDirectoryPath}/${filename}`;
            await RNFS.writeFile(path, base64Data, 'base64');

            ToastService.success('Download Successful', `File saved to ${path}`);
            console.log('File downloaded to:', path);
        } catch (error) {
            console.error('Download error:', error);
            ToastService.error('Download Failed', 'There was an error saving the file.');
        }
    };

    const getYearOptions = (startYear = 2020) => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
            const y = (startYear + i).toString();
            return { label: y, value: y };
        }).reverse(); // latest first
    };

    const yearOptions = getYearOptions(2015);



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
                            <Text style={styles.headerTitle}>{t('statements.statements')}</Text>
                        </View>

                        <View style={styles.headerRightBlock}>
                            <TouchableOpacity style={styles.roundedIconBt} onPress={() => showModal()}>
                                <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
                            </TouchableOpacity>
                            {filterApplied && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                                    <Text style={styles.yearBadge}>{year}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setYear(defaultYear);
                                            setFilterApplied(false);
                                            getStatementsData(accountDetails.AccountId, 1, true, defaultYear);
                                        }}
                                        style={styles.clearFilterButton}
                                    >
                                        <Text style={styles.clearFilterText}>{t('common.clear_filter')}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <Portal>
                                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBottomContainer}>
                                    {/* Close Icon */}
                                    <IconButton
                                        icon="close"
                                        size={24}
                                        onPress={hideModal}
                                        style={styles.modalCloseIcon}
                                        iconColor="#fff"
                                    />
                                    <Text style={styles.sectionTitleModal}>{t('statements.statements_filters')}</Text>

                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>{t('statements.year')}</Text>
                                        <Dropdown
                                            data={yearOptions}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Year"
                                            placeholderStyle={{ color: '#ccc' }}
                                            value={year}
                                            onChange={item => setYear(item.value)}
                                            style={styles.dropdownStyle}
                                            containerStyle={{ backgroundColor: '#fff' }}
                                        />
                                        {/* <Image style={styles.calendarIcon} source={require('../../assets/images/calendar-icon.png')} /> */}
                                    </View>

                                    <View style={styles.buttonRow}>
                                        <Button
                                            mode="contained"
                                            onPress={hideModal}
                                            style={styles.closeButton}
                                            textColor="#000"
                                        >
                                            {t('common.close')}
                                        </Button>

                                        <Button
                                            mode="contained"
                                            onPress={() => {
                                                getStatementsData(accountDetails.AccountId, 1, true);
                                                hideModal();
                                                setFilterApplied(true);
                                            }}
                                            buttonColor="#FF5A00"
                                            style={styles.applyButton}
                                        >
                                            {t('common.apply')}
                                        </Button>
                                    </View>

                                </Modal>
                            </Portal>
                        </View>
                    </View>

                    <View
                        style={styles.MainScrollbar}
                        onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
                    >                    
                    <FlatList
                            data={statementData}
                            keyExtractor={(item, index) => `${item.DocumentTypeId}-${index}`}
                            contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
                            showsVerticalScrollIndicator={false}
                             onScroll={Animated.event(
                                                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                                            { useNativeDriver: false }
                                                        )}
                                                        scrollEventThrottle={16}
                                                        onContentSizeChange={(_, height) => setContentHeight(height)}
                            ListHeaderComponent={
                                <View style={styles.searchBlock}>
                                    <TextInput
                                        style={styles.searchFormInput}
                                        placeholder={t('common.search')}
                                        value={search}
                                        onChangeText={setSearch}
                                        mode='outlined'
                                        theme={{ roundness: 100, colors: { text: '#000', primary: '#000', background: '#fff' } }}
                                    />
                                    <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} />
                                </View>
                            }
                            ListFooterComponent={
                                loading && !refreshing ? (
                                    <View style={{ padding: 16 }}>
                                        <Text style={{ textAlign: 'center', color: '#666' }}>{t('common.loading_more')}</Text>
                                    </View>
                                ) : !hasMoreData ? (
                                    <View style={{ paddingVertical: 20 }}>
                                        <Text style={{ textAlign: 'center', color: '#aaa' }}>{t('common.no_more_data_to_load')}</Text>
                                    </View>
                                ) : (<View style={{ height: 60 }} />)
                            }
                            renderItem={({ item }) => (
                                <Card style={styles.cardItemMain}>
                                    <View style={styles.cardContentInner}>
                                        <View style={styles.leftCardCont}>
                                            <Card style={styles.cardWithIcon}>
                                                <Image style={styles.cardIconImg} source={require('../../assets/images/statements-icon.png')} />
                                            </Card>

                                            <View style={styles.leftTextCard}>
                                                <Text style={[styles.textCard, { fontFamily: 'Poppins-SemiBold' }]}>{item.ReferenceNumber}</Text>
                                                <View style={[styles.textCard, { flexDirection: 'row', alignItems: 'center' }]}>
                                                    <Image
                                                        style={[styles.calenderIcon, { marginRight: 6 }]}
                                                        source={require('../../assets/images/calendar-icon.png')}
                                                    />
                                                    <Text style={styles.textCard}>{dayjs(item.IssueDate).format('YYYY-MM-DD HH:mm')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.rightTextCard}>
                                            <TouchableOpacity
                                                onPress={() => handleDownload(item.DocumentContent, `Statement-${item.FinancialDocumentID}-${dayjs(item.PeriodTo).format('YYYY-MM-DD')}.pdf`)}
                                            >
                                                <Card style={styles.downloadIcon}>
                                                    <Image
                                                        style={styles.cardIconImg}
                                                        source={require('../../assets/images/download-white-icon.png')}
                                                    />
                                                </Card>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </Card>
                            )}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (hasMoreData && !loading) {
                                    getStatementsData(accountDetails.AccountId, page + 1);
                                }
                            }}
                            refreshing={refreshing}
                            onRefresh={() => {
                                getStatementsData(accountDetails.AccountId, 1, true);
                            }}
                        /></View>
                    {contentHeight > visibleHeight && (
                        <Animated.View
                            style={{
                                position: 'absolute',
                                right: 4,
                                top: 100,
                                width: 6,
                                height: Math.max((visibleHeight / contentHeight) * visibleHeight, 30),
                                backgroundColor: '#FF5A00',
                                borderRadius: 3,
                                transform: [
                                    {
                                        translateY: scrollY.interpolate({
                                            inputRange: [0, contentHeight - visibleHeight],
                                            outputRange: [0, visibleHeight - ((visibleHeight / contentHeight) * visibleHeight)],
                                            extrapolate: 'clamp',
                                        }),
                                    },
                                ],
                            }}
                        />
                    )}
                </View>
            </ImageBackground>
        </PaperProvider>

    );
};
export default Statements;
const styles = StyleSheet.create({
    MainScrollbar: {
        flex: 1,
        position: 'relative',
    },
    //--- Header
    backgroundImage: {
   
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
    downloadIcon: {
        width: 70,
        height: 50,
        backgroundColor: '#707070',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0,
        elevation: 0,
        shadowColor: 'transparent',
        marginRight: 5,
        padding: 0,
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
        marginRight: 5,
        padding: 0,
    },

    cardIconImg: {
        width: 18,
        height: 18,
        tintColor: 'white'
    },

    tranupIcon: {
        width: 18,
        height: 18,
        marginRight: 3,
    },
    calenderIcon: {
        width: 13,
        height: 13,
        marginRight: 3,
    },

    leftTextCard: {
        // paddingRight: 10,
    },

    leftCardCont: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '71%',
    },

    textCard: {
        fontSize: 12,
        color: '#fff',
        paddingBottom: 2,
    },
    rightTextCard: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 6,
    },

    largeTextRCard: {
        color: '#fff',
        fontSize: 16,

    },
    statusTextCard: {

        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 30,
        marginTop: 5,
    },
    statusText: { color: '#06F547', fontSize: 14, },

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
        height: 40,
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
    modalCloseIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    dropdownStyle: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    yearBadge: {
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
        color: '#000',
        fontWeight: 'bold',
        marginRight: 6,
    },

    clearFilterButton: {
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    clearFilterText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '500',
    },
});