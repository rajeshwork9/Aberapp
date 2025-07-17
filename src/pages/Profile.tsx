import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, TextInput, Modal, Portal, PaperProvider, Button, Avatar, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAccount } from '../context/AccountProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../App';
import { getCustomerTypes, getUserInfo, changePassword } from '../services/common';
import { ToastService } from '../utils/ToastService';


const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { setLoggedIn } = useAuth();
  const [secureText, setSecureText] = useState(true);
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [visible, setVisible] = useState(false);
  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const { accounts, activeId, selectAccount, full, loadFullById } = useAccount();
  const [pendingId, setPendingId] = useState<any>();
  const [pendingDetails, setPendingDetails] = useState<any>();
  const [customerTypeData, setCustomerTypeData] = useState<any>();
  const [userData, setUserData] = useState<any>();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ old: '', new: '', confirm: '' });

  console.log('accounts', accounts);
  console.log('accounts full', full);



  const toggleSecureEntry = () => setSecureText(!secureText);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showDetailModal = () => setViewDetailModal(true);
  const hideDetailModal = () => setViewDetailModal(false);
  const showLanguageModal = () => setLanguageModal(true);
  const hideLangugeModal = () => setLanguageModal(false);

  useEffect(() => {
    customerTypes();
    userInfo();
  }, [])


  const [language, setLanguage] = useState('en'); // default to English

  const handleLogout = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');

      if (savedEmail && savedPassword) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'activeAccountId']);
      } else {
        await AsyncStorage.clear();
      }

      setLoggedIn(false); // ✅ This switches stack to Login automatically
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSetPrimary = () => {
    console.log('oending', pendingId)
    if (pendingId !== undefined && pendingId !== activeId) {
      selectAccount(pendingId);   //  switch account
    }
    setViewDetailModal(false);     // close modal
    navigation.goBack();           // optional → return to previous screen
  };
  const pendingAccount: any = accounts.find(acc => acc.AccountId === pendingId);

  const handleAccountPress = async (id: number) => {
    setPendingId(id);
    const details = await loadFullById(id);
    console.log(details, "details");
    if (details) {
      setPendingDetails(details);
      setViewDetailModal(true);
    }
  };

  const customerTypes = async () => {
    const customerType = await getCustomerTypes();
    console.log(customerType, "customerType");
    setCustomerTypeData(customerType);
  };

  const userInfo = async () => {
    const userData = await getUserInfo();
    console.log(userData, "userData");
    setUserData(userData);
  };


  const handlechangepassword = async () => {
    const newErrors = {
      old: oldPassword ? '' : 'Old password is required',
      new: newPassword ? '' : 'New password is required',
      confirm:
        confirmPassword !== newPassword
          ? 'Passwords do not match'
          : confirmPassword
            ? ''
            : 'Please confirm your new password',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors) {
      console.log('Old Password:', oldPassword);
      console.log('New Password:', newPassword);
      console.log('Confirm Password:', confirmPassword);
      try {
        let payload = {
          Currentpassword: oldPassword,
          Newpassword: newPassword,
          Newpasswordconfirmed: confirmPassword
        }
        const response = await changePassword(payload);
        console.log(response, "change password");
        if (response.status == 200) {
          ToastService.success('Password Changed Successfully!, Please login again');
          handleLogout();
        }

      }
      catch {

      }
      finally {

      }
      hideModal(); // Optionally close the modal
    }
  };

  const handleLanuageModal = async () => {

  }



  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <PaperProvider>
        <View style={styles.headerMain}>
          <View style={styles.headerLeftBlock}>
            <TouchableOpacity
              style={[styles.backBt, { marginRight: 12 }]}
              onPress={() => navigation.goBack()}
            >
              <Image
                style={styles.headerIcon}
                source={require('../../assets/images/left-arrow.png')}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.innerContainerPad}>
            <Avatar.Icon size={72} style={styles.avatarIcon} icon="account" />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { fontSize: 15, fontWeight: '500', lineHeight: 25 }]}>
                {userData?.Title} {userData?.FirstName} {userData?.LastName}
              </Text>
              <Text style={[styles.userName, { fontSize: 13, fontWeight: '400' }]}>
                {userData?.Email}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Accounts</Text>

            {accounts.map(account => {
              const isActive = account.AccountId === activeId;
              return (
                <TouchableOpacity
                  key={account.AccountId}
                  style={isActive ? styles.activeCardItemMain : styles.cardItemMain}
                  onPress={() => {
                    setPendingId(account.AccountId);   // store which one was tapped
                    handleAccountPress(account.AccountId);
                    // selectAccount(account.AccountId);
                    // navigation.goBack();
                  }}
                >
                  <View style={styles.cardContentInner}>
                    <View style={styles.leftCardCont}>
                      <Card style={styles.cardWithIcon}>
                        <Image
                          style={styles.cardIconImg}
                          source={require('../../assets/images/address-icon.png')}
                        />
                      </Card>
                      <View style={styles.leftTextCard}>
                        <Text style={styles.textCard}>{account.AccountName}</Text>
                        <Text style={styles.smallLabel}>Customer ID</Text>
                        <Text style={styles.smallTextCard}>{account.AccountCode}</Text>
                      </View>
                    </View>
                    {isActive && (
                      <Image
                        style={styles.tickmarkPosition}
                        source={require('../../assets/images/tickmark.png')}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text
              style={[
                styles.sectionTitle,
                { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 8 },
              ]}
            >
              Settings
            </Text>

            {/* Change Password Button */}
            <TouchableOpacity style={styles.profileBt} onPress={showModal}>
              <Image
                style={styles.iconProBt}
                source={require('../../assets/images/changepassword-icon.png')}
              />
              <Text style={styles.textProBt}>Change Password</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Portal>
              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBottomContainer}>
                <Text style={styles.sectionTitleModal}>Change password</Text>

                <View style={styles.formGroupModal}>
                  <TextInput
                    placeholder="Enter Old Password"
                    style={styles.inputModal}
                    placeholderTextColor="#ccc"
                    textColor="#fff"
                    secureTextEntry={secureOld}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    error={!!errors.old}
                    theme={{ colors: { primary: '#FF5400' } }}
                  />
                  <TouchableOpacity onPress={() => setSecureOld(prev => !prev)} style={styles.passwordIcon}>
                    <Icon name={secureOld ? 'eye-off' : 'eye'} size={20} color="#ffffff" />
                  </TouchableOpacity>
                  {!!errors.old && <Text style={{ color: 'red' }}>{errors.old}</Text>}
                </View>

                <View style={styles.formGroupModal}>
                  <TextInput
                    placeholder="Enter New Password"
                    style={styles.inputModal}
                    placeholderTextColor="#ccc"
                    textColor="#fff"
                    secureTextEntry={secureNew}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    error={!!errors.new}
                    theme={{ colors: { primary: '#FF5400' } }}
                  />
                  <TouchableOpacity onPress={() => setSecureNew(prev => !prev)} style={styles.passwordIcon}>
                    <Icon name={secureNew ? 'eye-off' : 'eye'} size={20} color="#ffffff" />
                  </TouchableOpacity>
                  {!!errors.new && <Text style={{ color: 'red' }}>{errors.new}</Text>}
                </View>

                <View style={styles.formGroupModal}>
                  <TextInput
                    placeholder="Confirm New Password"
                    style={styles.inputModal}
                    placeholderTextColor="#ccc"
                    textColor="#fff"
                    secureTextEntry={secureConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={!!errors.confirm}
                    theme={{ colors: { primary: '#FF5400' } }}
                  />
                  <TouchableOpacity onPress={() => setSecureConfirm(prev => !prev)} style={styles.passwordIcon}>
                    <Icon name={secureConfirm ? 'eye-off' : 'eye'} size={20} color="#ffffff" />
                  </TouchableOpacity>
                  {!!errors.confirm && <Text style={{ color: 'red' }}>{errors.confirm}</Text>}
                </View>

                <View style={styles.buttonRow}>
                  <Button mode="contained" onPress={hideModal} style={styles.closeButton} textColor="#000">
                    Close
                  </Button>
                  <Button mode="contained" onPress={handlechangepassword} buttonColor="#FF5A00" style={styles.applyButton}>
                    Apply
                  </Button>
                </View>
              </Modal>
            </Portal>

            {/*Details Modal*/}
            <Portal>
              <Modal
                visible={viewDetailModal}
                onDismiss={hideDetailModal}
                contentContainerStyle={styles.modalBottomContainer}
              >
                <View style={{ position: 'relative' }}>
                  {/* Header */}
                  <Text style={styles.sectionTitleModal}>Account Details</Text>

                  {/* Close button (top-right) */}
                  <TouchableOpacity
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    onPress={hideDetailModal}
                  >
                    {/* <Image
          source={require('../../assets/images/close-icon.png')}
          style={{ width: 24, height: 24, margin: 10 }}
        /> */}
                  </TouchableOpacity>
                </View>

                {/* Detail Fields */}
                {pendingDetails && (
                  <View style={{ marginTop: 20 }}>
                    {[
                      { label: 'Customer ID', value: userData?.CustomerCode },
                      { label: 'Customer Type', value: customerTypeData.find((item: any) => item.ItemId == userData.CustomerTypeId)?.ItemName || '-' },
                      { label: 'Company Name', value: userData.CompanyName },
                      { label: 'Trading Name', value: userData.TradingName || '-' },
                      { label: 'Address', value: `${userData?.AddressLine1 || ''} ${userData?.AddressLine2 || ''}` || '-' },
                    ].map((item, index) => (
                      <View key={index} style={{ marginBottom: 18 }}>
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{item.label}</Text>
                        <Text style={{ color: '#fff', fontWeight: '400', fontSize: 12 }}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                )}


                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  <Button
                    mode="contained"
                    onPress={hideDetailModal}
                    style={styles.closeButton}
                    textColor="#000"
                  >
                    Close
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSetPrimary}
                    buttonColor="#FF5A00"
                    style={styles.applyButton}
                  >
                    Set as Primary
                  </Button>
                </View>
              </Modal>
            </Portal>


            {/* Static Profile Options */}
            <TouchableOpacity style={styles.profileBt}>
              <Image style={styles.iconProBt} source={require('../../assets/images/gethelp-icon.png')} />
              <Text style={styles.textProBt}>Get Help</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileBt} onPress={showLanguageModal}>
              <Image style={styles.iconProBt} source={require('../../assets/images/language-icon.png')} />
              <Text style={styles.textProBt}>Language</Text>
            </TouchableOpacity>

            <Portal>
              <Modal visible={languageModal} onDismiss={hideLangugeModal} contentContainerStyle={styles.modalBottomContainer}>
  <Text style={styles.sectionTitleModal}>Select Language</Text>

  <RadioButton.Group
  onValueChange={newValue => setLanguage(newValue)}
  value={language}
>
  <TouchableOpacity
    style={styles.radioOption}
    onPress={() => setLanguage('en')}
  >
    <RadioButton value="en" color="#ff5200" />
    <Text
      style={[
        styles.radioText,
        language === 'en' && styles.radioTextSelected,
      ]}
    >
      English
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.radioOption}
    onPress={() => setLanguage('ur')}
  >
    <RadioButton value="ur" color="#ff5200" />
    <Text
      style={[
        styles.radioText,
        language === 'ur' && styles.radioTextSelected,
      ]}
    >
      Urdu
    </Text>
  </TouchableOpacity>
</RadioButton.Group>

  
</Modal>
            </Portal>

            <TouchableOpacity style={styles.profileBt} onPress={handleLogout}>
              <Image style={styles.iconProBt} source={require('../../assets/images/logout-icon.png')} />
              <Text style={styles.textProBt}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </PaperProvider>
    </ImageBackground>
  );
};

export default Profile;


const styles = StyleSheet.create({
   radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioText: {
    fontSize: 15,
    color: '#fff',
  },
  
  
 
  footerAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.51)',
    alignItems: 'center',
    paddingVertical: 10,
  },
  //--- Header
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 10,

  },

  innerContainerPad: {
    paddingBottom: 70,
    marginHorizontal: 20,
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
  sectionTitle: {
    marginVertical: 20,
    fontSize: 17,
    color: '#fff',
    fontWeight: 'normal',
  },

  avatarIcon: {
    marginTop: 2,
    backgroundColor: '#0FA9A6',
    margin: 'auto',


  },
  userInfo: { marginLeft: 7, },
  userName: { marginTop: 5, color: '#fff', paddingVertical: 1, textAlign: 'center', },

  // --
  cardItemMain: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 0,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#fff',
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    shadowOpacity: 0,
    elevation: 0,
  },
  activeCardItemMain: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 0,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FF5400',
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    shadowOpacity: 0,
    elevation: 0,
  },

  tickmarkPosition: {
    position: 'absolute',
    right: 10,
    bottom: 15,
    width: 30,
    height: 30,
  },

  cardContentInner: {
    marginTop: 0,
    borderRadius: 50,
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardWithIcon: {
    width: 54,
    height: 54,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0,
    elevation: 0,
    shadowColor: 'transparent',
    marginRight: 15,
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

  },

  textCard: {
    fontSize: 12,
    color: '#fff',
    paddingBottom: 2,
    flex: 1,
    // maxWidth:'86%',
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

  profileBt: { flexDirection: 'row', marginTop: 5, marginBottom: 20, },
  iconProBt: { width: 20, height: 20, marginRight: 10, },
  textProBt: { fontSize: 14, color: '#fff', },

  // ------

  // --
  modalBottomContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 40,
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
    marginVertical: 15,
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
    marginTop: 30,
  },

  applyButton: {

    color: '#fff',
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 20,
    fontSize: 12,
    marginHorizontal: 5,
    width: 160,
    height: 55,
    paddingTop: 5


  },

  closeButton: {
    backgroundColor: '#FFFFFF',
    color: '#000',
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 20,
    fontSize: 12,
    marginHorizontal: 5,
    width: 160,
    height: 55,
    paddingTop: 5
  },

  passwordIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,

    height: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});