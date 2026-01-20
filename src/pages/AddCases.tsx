import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Text, Card, Icon, TextInput, Modal, Portal, PaperProvider, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Dropdown } from 'react-native-element-dropdown';
import { useAccount } from '../context/AccountProvider';
import { getCaseTypes,addCases } from '../services/common';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../App';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface CaseTypes {
    AdditionalData: string,
    ItemId: number,
    ItemName: string
};

const validationSchema = Yup.object().shape({
    caseType: Yup.string().required('Case Type is required'),
    title: Yup.string().trim().required('Title is required'),
    message: Yup.string().trim().required('Message is required'),
});

const AddCases: React.FC = () => {
    type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'AddCases'>;
    const navigation = useNavigation<NavigationProp>();
    const { full } = useAccount();
    const {t} = useTranslation();
    const insets = useSafeAreaInsets();
    const [value, setValue] = useState(null);
    const [accountDetails, setAccountDetails] = useState<any>();
    const [caseTypes, setCaseTypes] = useState<CaseTypes[]>([]);

    useEffect(() => {
        setAccountDetails(full);
    }, [full]);

    useEffect(() => {
        getcaseTypesData();
    }, [])

    const getcaseTypesData = async () => {
        try {
            const response = await getCaseTypes();
            setCaseTypes(response);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            console.log('Api completed');
        }
    };

    const submitCase = async (values: any, resetForm: () => void) => {
        const payload = {
            accountId: Number(values.accountId),
            CaseTypeId: Number(values.caseType),
            Comment: values.message,
            Title: values.title
        };
        try {
            const response : any = await addCases(payload);
            console.log(response);
            if (response?.CaseId) {
            console.log("Case submitted successfully with ID:", response.CaseId);
            resetForm();
            navigation.navigate('Cases')
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {

        }
    }

    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                <PaperProvider>
                    <View style={styles.headerMain}>
                        <View style={styles.headerLeftBlock} >
                            <TouchableOpacity style={[styles.backBt, { marginRight: 12, }]} onPress={() => navigation.goBack()}>
                                <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>{t("cases.add_new_cases")}</Text>
                        </View>
                    </View>

                     <Formik
                        initialValues={{
                            accountId: full?.AccountId?.toString() || '',
                            caseType: '',
                            title: '',
                            message: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values,{ resetForm }) => {
                            submitCase(values, resetForm);
                        }}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            values,
                            errors,
                            touched,
                        }) => (
                            <ScrollView >
                                <View style={styles.containerInner}>
                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>{t("cases.account_id")}</Text>
                                        {full?.AccountId && (
                                            <TextInput
                                                style={styles.formControl}
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.accountId}
                                                editable={false}
                                            />

                                        )}
                                    </View>
                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>{t("cases.case_type")} *</Text>
                                        <Dropdown
                                            style={styles.selectDropdown}
                                            placeholderStyle={styles.placeholderSelect}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            data={caseTypes}
                                            labelField="ItemName"
                                            valueField="ItemId"
                                            placeholder="Select Case Type"
                                            containerStyle={styles.dropdownList}
                                            activeColor="#000000"
                                            value={value}
                                            onChange={(item) => setFieldValue('caseType', item.ItemId.toString())}
                                            renderItem={item => (
                                                <View style={styles.listSelectGroup}>
                                                    <Text style={styles.itemTextSelect}>{item.ItemName}</Text>
                                                </View>
                                            )}
                                        />
                                        {touched.caseType && errors.caseType && (
                                            <Text style={styles.errorText}>{errors.caseType}</Text>
                                        )}
                                    </View>
                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>{t("cases.title")} *</Text>
                                        <TextInput
                                            style={styles.formControl}
                                            placeholder="Enter your Title here"
                                            placeholderTextColor="#9F9F9F"
                                            cursorColor="#fff"
                                            textColor='#fff'
                                            theme={{
                                                colors: {
                                                    primary: '#FF5400',
                                                },
                                            }}
                                            value={values.title}
                                            onChangeText={handleChange('title')}
                                            onBlur={handleBlur('title')}

                                        />
                                        {touched.title && errors.title && (
                                            <Text style={styles.errorText}>{errors.title}</Text>
                                        )}
                                    </View>
                                    <View style={styles.formGroupModal}>
                                        <Text style={styles.labelModal}>{t("cases.message")} *</Text>
                                        <TextInput
                                            style={styles.formControl}
                                            placeholder="Enter your Message here"
                                            placeholderTextColor="#9F9F9F"
                                            cursorColor="#fff"
                                            textColor='#fff'
                                            theme={{
                                                colors: {
                                                    primary: '#FF5400',
                                                },
                                            }}
                                            value={values.message}
                                            onChangeText={handleChange('message')}
                                            onBlur={handleBlur('message')}

                                        />
                                        {touched.message && errors.message && (
                                            <Text style={styles.errorText}>{errors.message}</Text>
                                        )}
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <Button
                                            mode="contained"
                                            style={styles.closeButton}
                                            textColor="#000"
                                            onPress={() => navigation.goBack()}
                                        >
                                            {t("common.close")}
                                        </Button>

                                        <Button
                                            mode="contained"

                                            buttonColor="#FF5A00"
                                            style={styles.applyButton}
                                            onPress={() => handleSubmit()}
                                        >
                                             {t("common.add")}
                                        </Button>
                                    </View>

                                </View>
                            </ScrollView>
                        )}
                    </Formik>
                </PaperProvider>
            </View>
            </SafeAreaView>
        </ImageBackground>
    );
};
export default AddCases;

const styles = StyleSheet.create({

    //--- Header
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: 5,
        marginTop: 10,

    },

    containerInner: {
        marginHorizontal: 40,
        marginTop: 10,

    },

    headerMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: 'transparent',
        

    },
    backBt: {},
    headerLeftBlock: { flexDirection: 'row', justifyContent: 'flex-start', },
    headerRightBlock: { flexDirection: 'row', justifyContent: 'flex-end', },
    headerIcon: { width: 18, height: 18, },
    headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },

    //--- Header End

    //---

    formGroupModal: { marginTop: 10, marginBottom: 25, },


    labelModal: { color: '#fff', fontSize: 13, marginBottom: 5, },
    selectDropdown: {
        width: '100%',
        marginHorizontal: 0,
        height: 50,
        borderRadius: 0,
        color: '#fff',
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderBottomColor: '#fff',
        borderBottomWidth: 1
    },
    formControl: {
        paddingHorizontal: 0,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: 'white !important',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
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
        justifyContent: 'space-between',
    },

    applyButton: {
        width: 150,
        paddingTop: 0,
        paddingBottom: 4,
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 0,


    },

    closeButton: {
        width: 150,
        paddingTop: 0,
        paddingBottom: 4,
        backgroundColor: '#FFFFFF',
        color: '#000',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
        fontSize: 13,
        marginHorizontal: 0,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },

});