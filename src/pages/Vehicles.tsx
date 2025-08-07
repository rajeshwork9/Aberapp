import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  RefreshControl,
  Animated,
  Keyboard,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Modal,
  Portal,
  PaperProvider,
  Button,
  IconButton
} from 'react-native-paper';
import { getVehiclesList, getOverallClasses, searchVehicle } from '../services/common';
import { useAccount } from '../context/AccountProvider';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';

type VehicleItem = {
  AssetId: number;
  AssetIdentifier: string;
  OverallClassId: number;
  ValidFromDate: string;
  Vehicle?: {
    UnloadedWeight?: number;
    [key: string]: any;
  };
  [key: string]: any;
};


type VehicleScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Vehicles'
>;
type Props = { navigation: VehicleScreenNavigationProp };
const Vehicles: React.FC<Props> = ({ navigation }) => {
  // const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const containerStyle = { backgroundColor: 'white', padding: 100 };

  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [vehiclesList, setVehiclesList] = useState<VehicleItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [typesData, setTypesData] = useState<any[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [visibleHeight, setVisibleHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1)
  const scrollY = useRef(new Animated.Value(0)).current;


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const { t } = useTranslation()

  const { accounts, activeId, selectAccount, full } = useAccount();

  useEffect(() => {
    getVehicles(1, true);
    getTypes();
  }, []);

  const getVehicles = async (pageNumber: number, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const payload = {
        accountId: full.AccountId,
        AssetTypeId: 0,
        PageNumber: pageNumber,
        PageSize: pageSize,
      };

      const res = await getVehiclesList(payload);
      console.log(res, 'vehicle');
      const PAGE_SIZE = 10;
      const newList = res.List || [];
      if (isRefresh || pageNumber === 1) {
        setVehiclesList(newList);
      } else {
        setVehiclesList((prev: any) => [...prev, ...newList]);
      }

      setHasMoreData(newList.length === PAGE_SIZE);

      setPage(pageNumber);


    } catch (err) {
      console.error('Vehicle fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const handleDetailsPage = async (data: any) => {
    console.log(data, "hadle details");
    navigation.navigate('VehicleDetails', { state: data })
  }

  const handleVehicleSearch = async (searchtext: string) => {
    setSearch(searchtext);
    console.log(searchtext.length)
    if (search && searchtext.length > 2) {
      try {
        let payload = {
          accountId: full.AccountId,
          Identifier: searchtext
        }
        console.log(payload);

        const response = await searchVehicle(payload);
        console.log(response);
        setVehiclesList(response || []);
        setHasMoreData(false);
      }
      catch (error) {
        console.error(error);
      }
      finally {

      }
    }
    else {
      getVehicles(1, true);
    }
  }

  return (
    <PaperProvider>

      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={{ flex: 1 }}>
          <View style={styles.headerMain}>
            <View style={styles.headerLeftBlock}>
              <TouchableOpacity style={[styles.backBt, { marginRight: 12 }]} onPress={() => navigation.goBack()}>
                <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t('vehicles.vehicles')}</Text>
            </View>

            <View style={styles.headerRightBlock}>
              <TouchableOpacity onPress={() => navigation.navigate('AddVehicle')} style={[styles.btHeader, { marginRight: 12 }]}>
                <Text style={styles.btHeaderText}>{t('vehicles.add_vehicles')}</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.roundedIconBt} onPress={showModal}>
                <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
              </TouchableOpacity> */}

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
                  <Text style={styles.sectionTitleModal}>{t('vehicles.vehicle_filters')}</Text>

                  <View style={styles.formGroupModal}>
                    <Text style={styles.labelModal}>{t('common.from_date')}</Text>
                    <TextInput
                      mode="flat"
                      placeholder="DD-MM-YYYY"
                      style={styles.calendarInputModal}
                      underlineColor="#fff"
                      placeholderTextColor="#707070"
                      textColor="#fff"
                      theme={{ colors: { primary: '#FF5400' } }}
                    />
                    <Image style={styles.calendarIcon} source={require('../../assets/images/calendar-icon.png')} />
                  </View>

                  <View style={styles.formGroupModal}>
                    <Text style={styles.labelModal}>{t('common.to_date')}</Text>
                    <TextInput
                      mode="flat"
                      style={styles.calendarInputModal}
                      underlineColor="#fff"
                      placeholder="DD-MM-YYYY"
                      placeholderTextColor="#707070"
                      textColor="#fff"
                      theme={{ colors: { primary: '#FF5400' } }}
                    />
                    <Image style={styles.calendarIcon} source={require('../../assets/images/calendar-icon.png')} />
                  </View>

                  <View style={styles.buttonRow}>
                    <Button mode="contained" onPress={hideModal} style={styles.closeButton} textColor="#000">
                      {t('common.close')}
                    </Button>
                    <Button
                      mode="contained"
                      onPress={hideModal}
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
            <View style={styles.searchBlock}>
              <TextInput
                style={styles.searchFormInput}
                placeholder={t('common.search')}
                placeholderTextColor="#7B8994"
                value={search}
                onChangeText={(text) => handleVehicleSearch(text)}
                mode="outlined"
                theme={{ roundness: 100, colors: { text: '#000', primary: '#000', background: '#fff' } }}
              />
              <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => { setSearch(''); getVehicles(1, true); Keyboard.dismiss(); }} style={styles.clearIcon}>
                  <Image source={require('../../assets/images/close-icon.png')} style={{ width: 16, height: 16 }} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={vehiclesList}
              keyExtractor={(item, index) => `${item.AssetId}-${index}`}
              contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              onContentSizeChange={(_, height) => setContentHeight(height)}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <Card style={styles.cardItemMain} onPress={() => handleDetailsPage(item)}>
                  <View style={styles.cardContentInner}>
                    <View style={styles.leftCardCont}>
                      <Card style={styles.cardWithIcon}>
                        <Image style={styles.cardIconImg} source={require('../../assets/images/vehicles-icon.png')} />
                      </Card>
                      <View style={styles.leftTextCard}>
                        <Text style={styles.textCard}>{item.AssetIdentifier}</Text>
                        <Text style={[styles.deateCard, { fontWeight: 'light' }]}>
                          {new Date(item.ValidFromDate).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightTextCard}>
                      <Text style={styles.largeTextRCard}> {String(typesData.find((data: any) => item.OverallClassId == data.ItemId)?.ItemName ?? '')} </Text>

                    </View>
                  </View>
                </Card>
              )}
              onEndReached={() => {
                if (!loading && hasMoreData) {
                  getVehicles(page + 1);
                }
              }}
              onEndReachedThreshold={0.3}
              refreshing={refreshing}
              onRefresh={() => getVehicles(1, true)}
              ListFooterComponent={
                vehiclesList.length > 0 ? (
                  loading && !refreshing ? (
                    <View style={{ paddingVertical: 20 }}>
                      <Text style={{ textAlign: 'center', color: '#fff' }}>{t('common.loading_more')}</Text>
                    </View>
                  ) : !hasMoreData ? (
                    <View style={{ paddingVertical: 20 }}>
                      <Text style={{ textAlign: 'center', color: '#aaa' }}>
                        {t('common.no_more_data_to_load')}
                      </Text>
                    </View>
                  ) : null
                ) : null
              }
              ListEmptyComponent={
                !loading ? (
                  <View style={{ alignItems: 'center', marginTop: 100 }}>
                    <Text style={{ color: '#aaa', fontSize: 16 }}>{t('common.no_results_found')}</Text>
                  </View>
                ) : null
              }

            />  </View>

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

export default Vehicles;

const styles = StyleSheet.create({
  MainScrollbar: {
    flex: 1,
    position: 'relative',
  },
  //--- Header
  backgroundImage: {
    flex: 1,

  },

  container: {
    marginHorizontal: 10,
    marginTop: 20,
    paddingBottom: 40,
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
    position: 'relative',

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
  modalCloseIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  clearIcon: {
    position: 'absolute',
    right: 40,
    top: '50%',
    transform: [{ translateY: -8 }],
    zIndex: 1,
  },
});