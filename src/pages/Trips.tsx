// imports remain the same
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image, FlatList, ActivityIndicator } from 'react-native';
import { Button, TextInput, Modal, Portal, Text, Card, PaperProvider, IconButton, } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import dayjs from 'dayjs';
import { getLicenceNumber, getTodaysTrips, getOverallClasses } from '../services/common';
import { useAccount } from '../context/AccountProvider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Trip {
  AssetId: string;
  VRM: string;
  LocationName: string;
  TransactionId: string;
  TransactionDate: string;
  AmountFinal: string;
}

interface LPN {
  label: string;
  value: string;
  AssetIdentifier: string;
  OverallClassId: number;
}

const Trips: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { full } = useAccount();

  const [search, setSearch] = useState('');
  const [tripsData, setTripsData] = useState<Trip[]>([]);
  const [accountDetails, setAccountDetails] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lpnData, setLpnData] = useState<LPN[] | any>([]);
  const [lpnValue, setLpnValue] = useState<any>();
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [typesData, setTypesData] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const isFetchingMore = useRef(false);
  const [clearFilterRequested, setClearFilterRequested] = useState(false);



  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setAccountDetails(full);
  }, [full]);

  useEffect(() => {
    if (accountDetails) {
    console.log(accountDetails);

      getTrips(accountDetails.AccountId, 1, true);
      licenceNumber(accountDetails.AccountId);
      getTypes();
    }
  }, [accountDetails]);

  useEffect(() => {
  if (clearFilterRequested && lpnValue === 0) {
    setClearFilterRequested(false);
    getTrips(accountDetails.AccountId, 1, true, dayjs().subtract(7, 'day').toDate(), new Date());
  }
}, [clearFilterRequested, lpnValue]);

const getTrips = async (
  accountId: number,
  pageNumber: number,
  isRefresh = false,
  fromDateParam?: Date,
  toDateParam?: Date
) => {
  if (!isRefresh && isFetchingMore.current) return;

  try {
    if (!isRefresh) isFetchingMore.current = true;
    isRefresh ? setRefreshing(true) : setLoading(true);

    const fromDatetime = dayjs(fromDateParam || fromDate)
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
    const toDatetime = dayjs(toDateParam || toDate)
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss[Z]');

    const payload = {
      accountId,
      AccountUnitId: lpnValue ? lpnValue : 0,
      GantryId: 0,
      fromDate: fromDatetime,
      toDate: toDatetime,
      PageNumber: pageNumber,
      PageSize: 10,
    };
    console.log("paylod", payload);
    

    const response = await getTodaysTrips(payload);
    const newList = response.TransactionsList || [];

    const total = response.TotalRows || 0;
    const updatedList = isRefresh || pageNumber === 1 ? newList : [...tripsData, ...newList];

    setTripsData(updatedList);
    setPage(pageNumber);
    setHasMoreData(updatedList.length < total);
    setTotalRows(total);
  } catch (e) {
    console.error('Trips fetch error:', e);
  } finally {
    setLoading(false);
    setRefreshing(false);
    isFetchingMore.current = false;
  }
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
  }

  const handleClearFilter = () => {
    setFilterEnabled(false);
    setLpnValue(0);
    setPage(1);
    setHasMoreData(true);
    setClearFilterRequested(true);
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
    <PaperProvider>
      <ImageBackground source={require('../../assets/images/background.png')} style={styles.backgroundImage}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.headerMain}>
            <View style={styles.headerLeftBlock}>
              <TouchableOpacity style={[styles.backBt, { marginRight: 12 }]} onPress={() => navigation.goBack()}>
                <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Trips</Text>
            </View>

            <View style={styles.headerRightBlock}>
              <TouchableOpacity style={styles.roundedIconBt} onPress={showModal}>
                <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
              </TouchableOpacity>
              <View style={styles.btHeader}>
                {filterEnabled && (
                  <Button onPress={handleClearFilter} labelStyle={styles.filterText}>
                    Clear Filter
                  </Button>
                )}
              </View>

            </View>

          </View>

          {/* Filter Modal */}
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
              <Text style={styles.sectionTitleModal}>Trip Filters</Text>

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

              <View style={styles.formGroupModal}>
                <Text style={styles.labelModal}>Licence Plate Number</Text>
                <Dropdown
                  style={styles.selectDropdown}
                  placeholderStyle={styles.placeholderSelect}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={lpnData}
                  labelField="label"
                  valueField="value"
                  value={lpnValue}
                  onChange={item => setLpnValue(item.AccountUnitId)}
                />
              </View>

              <View style={styles.buttonRow}>
                <Button mode="contained" onPress={() => {
                  hideModal();
                  setLpnValue(null);
                }}
                  style={styles.closeButton} textColor="#000">
                  Close
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    hideModal();
                    if (accountDetails?.AccountId) {
                      getTrips(accountDetails.AccountId, 1, true, fromDate, toDate);
                      setFilterEnabled(true);
                    }
                    // Apply filter logic here
                  }}
                  buttonColor="#FF5A00"
                  style={[styles.applyButton]}
                >
                  {/* disabled={!lpnValue && !gantryValue} */}
                  Apply
                </Button>
              </View>
            </Modal>
          </Portal>

          {/* List with Search */}
          <FlatList
            data={tripsData}
            keyExtractor={(item, index) => `${item.AssetId}-${index}`}
            contentContainerStyle={styles.container}
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
              <Card style={styles.cardItemMain} onPress={() => navigation.navigate('TripsDetails')}>
                <View style={styles.cardContentInner}>
                  <View style={styles.leftCardCont}>
                    <Card style={styles.cardWithIcon}>
                      <Image style={styles.cardIconImg} source={require('../../assets/images/trips-icon.png')} />
                    </Card>
                    <View style={styles.leftTextCard}>
                      <Text style={styles.textCard}>{item.VRM}</Text>
                      <Text style={styles.textCard}>{item.LocationName}</Text>
                      <Text style={styles.textCard}>Transaction ID: {item.TransactionId}</Text>
                      <Text style={styles.textCard}>{dayjs(item.TransactionDate).format('YYYY-MM-DD HH:mm')}</Text>
                    </View>
                  </View>
                  <View style={styles.rightTextCard}>
                    <Text style={styles.largeTextRCard}>{getClassNameFromVRM(item.VRM)}</Text>
                    <Image style={{ width: 16, height: 16, marginVertical: 4 }} source={require('../../assets/images/chat-icon.png')} />
                    <Text style={styles.statusTextCard}>
                      <Text style={[styles.statusText, { fontWeight: 'normal' }]}>Paid: </Text>
                      <Text style={[styles.statusText, { fontWeight: 'bold' }]}>{item.AmountFinal}</Text>
                    </Text>
                  </View>
                </View>
              </Card>
            )}
            onEndReached={() => {
              if (hasMoreData && !loading && !refreshing && !isFetchingMore.current) {
                getTrips(accountDetails.AccountId, page + 1, false, fromDate, toDate);
              }
            }}
            onEndReachedThreshold={0.1}
            refreshing={refreshing}
            onRefresh={() => getTrips(accountDetails.AccountId, 1, true, fromDate, toDate)}
            ListFooterComponent={
              loading && !refreshing ? (
                <View style={{ paddingVertical: 20 }}>
                 <Text style={{ textAlign: 'center', color: '#fff' }}>Loading more...</Text>
                </View>
              ) : tripsData.length >= totalRows ? (
                <View style={{ paddingVertical: 20 }}>
                  <Text style={{ textAlign: 'center', color: '#aaa' }}>No more data to load</Text>
                </View>
              ) : (<View style={{ height: 60 }} />)
            }
          />
        </View>
      </ImageBackground>
    </PaperProvider>
  );
};

export default Trips;

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
    marginRight: 5,
    padding: 0,
  },

  cardIconImg: {
    width: 30,
    height: 30,
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

});