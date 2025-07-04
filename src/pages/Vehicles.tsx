import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
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
} from 'react-native-paper';
import { getVehiclesList } from '../services/common';
import { useAccount } from '../context/AccountProvider';
import { usePaginatedList } from '../hooks/usePaginatedList';

const Vehicles: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const containerStyle = { backgroundColor: 'white', padding: 100 };

  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const navigateTo = (path: keyof MainStackParamList) => {
    navigation.navigate(path);
  };

  const { accounts, activeId, selectAccount, full } = useAccount();

  useEffect(() => {
    getVehicles(1, true);
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
      console.log(res,'vehicle')
      const newList = res.List || [];

      setTotalRows(res.TotalRows || 0);
      setPage(pageNumber);

      setVehiclesList(prev =>
        isRefresh || pageNumber === 1 ? newList : [...prev, ...newList]
      );
    } catch (err) {
      console.error('Vehicle fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
            <Text style={styles.headerTitle}>Vehicles</Text>
          </View>

          <View style={styles.headerRightBlock}>
            <TouchableOpacity onPress={() => navigateTo('AddVehicle')} style={[styles.btHeader, { marginRight: 12 }]}>
              <Text style={styles.btHeaderText}>Add Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.roundedIconBt} onPress={showModal}>
              <Image style={styles.roundedIcon} source={require('../../assets/images/filter-icon.png')} />
            </TouchableOpacity>

            <Portal>
              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBottomContainer}>
                <Text style={styles.sectionTitleModal}>Vehicle Filters</Text>

                <View style={styles.formGroupModal}>
                  <Text style={styles.labelModal}>From Date</Text>
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
                  <Text style={styles.labelModal}>To Date</Text>
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
                    Close
                  </Button>
                  <Button
                    mode="contained"
                    onPress={hideModal}
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
          data={vehiclesList}
          keyExtractor={(item, index) => `${item.AssetId}-${index}`}
          contentContainerStyle={styles.container}
          style={{flex:1}}
          ListHeaderComponent={
            <View style={styles.searchBlock}>
              <TextInput
                style={styles.searchFormInput}
                placeholder="Search"
                placeholderTextColor="#7B8994"
                value={search}
                onChangeText={setSearch}
                mode="outlined"
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
                  <Text style={styles.largeTextRCard}>2XL</Text>
                  <Text style={styles.statusTextCard}>
                    <Text style={[styles.statusText, { fontWeight: 'normal' }]}>Active</Text>
                  </Text>
                </View>
              </View>
            </Card>
          )}
          onEndReached={() => {
            if (!loading && vehiclesList.length < totalRows) {
              getVehicles(page + 1);
            }
          }}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={() => getVehicles(1, true)}
           ListFooterComponent={
            loading && !refreshing ? (
            <View style={{ paddingVertical: 20 }}>
                <Text style={{ textAlign: 'center', color: '#fff' }}>Loading more...</Text>
            </View>
            ) : vehiclesList.length >= totalRows ? (
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

export default Vehicles;

const styles = StyleSheet.create({

    //--- Header
    backgroundImage: {
        flex: 1,
 
    },

    container: {
        // flex: 1,
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
});