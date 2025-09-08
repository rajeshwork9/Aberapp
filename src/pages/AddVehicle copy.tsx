import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { addVehicle } from '../services/common';
import { Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { launchCamera, launchImageLibrary, type Asset } from 'react-native-image-picker';
import { pick, types } from '@react-native-documents/picker';
import { StyleSheet, ActionSheetIOS, View, TouchableOpacity, ScrollView, ImageBackground, Image, Platform, Pressable, Modal as RNModal } from 'react-native';
import { Text, Card, Icon, TextInput, Modal as PaperModal, Portal, PaperProvider, Button } from 'react-native-paper';

type PickedImage = {
    kind: 'image';
    uri: string;
    name?: string;
    type?: string;
    width?: number;
    height?: number;
    fileSize?: number;
};

type PickedDoc = {
    kind: 'document';
    uri: string;     // file:// or content://
    name?: string;   // filename
    type?: string;   // mime, e.g. application/pdf or image/jpeg
    size?: number;   // bytes
};

type FormValues = {
    companyLicenseNameEn: string;
    companyLicenseNo: string;
    companylicensenumber: string;
    noOfTrucks: string;
    email: string;
    mobile: string;
    companyDetails: string;
    companylicensedocument: PickedResult | null;
    companydocument: PickedResult | null;
    trucklicensedocument: PickedResult | null;
};



export type PickedResult = PickedImage | PickedDoc;

const validationSchema = Yup.object().shape({
    companyLicenseNameEn: Yup.string().required('Company License Name is required'),
    companyLicenseNo: Yup.string().trim().required('Company License Name Arabic is required'),
    companylicensenumber: Yup.string().trim().required('Company License Number is required'),
    noOfTrucks: Yup.string().trim().required('Trucks is required'),
    email: Yup.string().trim().email('Invalid email').required('Email is required'),
    mobile: Yup.string().trim().required('Mobile is required'),
    companyDetails: Yup.string().trim().required('Company Details is required'),
    companylicensedocument: Yup.mixed<PickedResult>().required('Company License Document is required'),
    companydocument: Yup.mixed<PickedResult>().required('Company Document is required'),
    trucklicensedocument: Yup.mixed<PickedResult>().required('Truck License Document is required'),
});

const AddVehicle: React.FC = () => {
    const navigation = useNavigation();
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [androidSheetVisible, setAndroidSheetVisible] = useState<null | {
        field: 'companylicensedocument' | 'companydocument' | 'trucklicensedocument';
    }>(null);
    const handleImageAsset = (asset: Asset | undefined): PickedImage | null => {
        if (!asset?.uri) return null;
        return {
            kind: 'image',
            uri: asset.uri,
            name: asset.fileName ?? undefined,
            type: asset.type ?? undefined,
            width: asset.width ?? undefined,
            height: asset.height ?? undefined,
            fileSize: asset.fileSize ?? undefined,
        };
    };

    const chooseCamera = async (): Promise<PickedResult | null> => {
        const res = await launchCamera({
            mediaType: 'photo',
            includeBase64: false,
            saveToPhotos: false,
            quality: 0.9,
        });
        if (res.didCancel || res.errorCode) return null;
        return handleImageAsset(res.assets?.[0]);
    };

    const chooseGallery = async (): Promise<PickedResult | null> => {
        const res = await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: false,
            selectionLimit: 1,
        });
        if (res.didCancel || res.errorCode) return null;
        return handleImageAsset(res.assets?.[0]);
    };

    const chooseDocuments = async (pdfOnly = false): Promise<PickedResult | null> => {
        try {
            const [file] = await pick({
                type: pdfOnly ? [types.pdf] : [types.pdf, types.images],
                allowMultiSelection: false,
            });
            return {
                kind: 'document',
                uri: file.uri,
                name: file.name || '',
                type: file.type || '',
                size: file.size || 0,
            };
        } catch {
            return null;
        }
    };

    // Show sheet per field; on iOS use ActionSheetIOS, on Android show our modal
    const openSheetForField = (
        field: 'companylicensedocument' | 'companydocument' | 'trucklicensedocument',
        setFieldValue: (f: string, v: any) => void
    ) => {
        console.log(field);

        const pdfOnly = field === 'trucklicensedocument';
        console.log(pdfOnly);

        const handlePick = async (src: 'camera' | 'gallery' | 'documents') => {
            let picked: PickedResult | null = null;
            if (src === 'camera') picked = await chooseCamera();
            else if (src === 'gallery') picked = await chooseGallery();
            else picked = await chooseDocuments(pdfOnly);

            if (picked) setFieldValue(field, picked);
        };

        if (Platform.OS === 'ios') {
            const options = pdfOnly
                ? ['Documents (PDF only)', 'Cancel']
                : ['Camera', 'Gallery', 'Documents', 'Cancel'];
            ActionSheetIOS.showActionSheetWithOptions(
                { options, cancelButtonIndex: 3 },
                async (idx) => {
                    if (idx === 0) await handlePick('camera');
                    if (idx === 1) await handlePick('gallery');
                    if (idx === 2) await handlePick('documents');
                }
            );
        } else {
            // open Android modal sheet and remember the target field
            setAndroidSheetVisible({ field });
        }
    };

    const submitCase = async (values: any, helpers: FormikHelpers<FormValues>) => {
        console.log(values);

        const payload = {
            accountId: Number(values.accountId),
            CaseTypeId: Number(values.caseType),
            Comment: values.message,
            Title: values.title
        };
        console.log(payload, "payload");
        setConfirmSubmit(true);
        return
        try {
            const response: any = await addVehicle(payload);
            console.log(response);
            if (response?.amount) {
                //resetForm();
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
            <PaperProvider>


                <View style={styles.headerMain}>
                    <View style={styles.headerLeftBlock} >
                        <TouchableOpacity style={[styles.backBt, { marginRight: 12, }]} onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={require('../../assets/images/left-arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Vehicle</Text>
                    </View>
                </View>

                <Formik
                    initialValues={{
                        companyLicenseNameEn: '',
                        companyLicenseNo: '',
                        companylicensenumber: '',
                        noOfTrucks: '',
                        email: '',
                        mobile: '',
                        companyDetails: '',
                        companylicensedocument: null as PickedResult | null,
                        companydocument: null as PickedResult | null,
                        trucklicensedocument: null as PickedResult | null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={submitCase}>
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue
                    }) => (
                        <ScrollView >
                            <View style={styles.container}>
                                <View style={styles.innerContainerPad}>
                                    <View style={styles.step1}>
                                        <Text style={styles.sectionTitle}>1. Company Details</Text>
                                        <View style={styles.formGroup}>
                                            <TextInput
                                                style={styles.formControl}
                                                placeholder="Company Licence Name *"
                                                placeholderTextColor="#9F9F9F"
                                                cursorColor="#fff"
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.companyLicenseNameEn}
                                                onChangeText={handleChange('companyLicenseNameEn')}
                                                onBlur={handleBlur('companyLicenseNameEn')}
                                            />
                                            {touched.companyLicenseNameEn && errors.companyLicenseNameEn && (
                                                <Text style={styles.errorText}>{errors.companyLicenseNameEn}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formGroup}>
                                            <TextInput
                                                style={styles.formControl}
                                                placeholder="Company Licence Name Arabic *"
                                                placeholderTextColor="#9F9F9F"
                                                cursorColor="#fff"
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.companyLicenseNo}
                                                onChangeText={handleChange('companyLicenseNo')}
                                                onBlur={handleBlur('companyLicenseNo')}
                                            />
                                            {touched.companyLicenseNo && errors.companyLicenseNo && (
                                                <Text style={styles.errorText}>{errors.companyLicenseNo}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formGroup}>
                                            <TextInput
                                                mode="flat"
                                                placeholder="Enter Company Licence Number *"
                                                style={styles.formControl}
                                                underlineColor="#9F9F9F"
                                                placeholderTextColor="#ccc"
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.companylicensenumber}
                                                onChangeText={handleChange('companylicensenumber')}
                                                onBlur={handleBlur('companylicensenumber')}
                                            />
                                            {touched.companylicensenumber && errors.companylicensenumber && (
                                                <Text style={styles.errorText}>{errors.companylicensenumber}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formGroup}>
                                            <TextInput
                                                mode="flat"
                                                placeholder="No Of Trucks To Register  *"
                                                style={styles.formControl}
                                                underlineColor="#fff"
                                                placeholderTextColor="#9F9F9F"
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.noOfTrucks}
                                                onChangeText={handleChange('noOfTrucks')}
                                                onBlur={handleBlur('noOfTrucks')}
                                            />
                                            {touched.noOfTrucks && errors.noOfTrucks && (
                                                <Text style={styles.errorText}>{errors.noOfTrucks}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formGroup}>
                                            <TextInput
                                                mode="flat"
                                                placeholder="Email *"
                                                style={styles.formControl}
                                                underlineColor="#fff"
                                                placeholderTextColor="#9F9F9F"
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                            />
                                            {touched.email && errors.email && (
                                                <Text style={styles.errorText}>{errors.email}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formGroup}>
                                            <TextInput
                                                mode="flat"
                                                placeholder="Mobile No *"
                                                style={styles.formControl}
                                                underlineColor="#fff"
                                                placeholderTextColor="#9F9F9F"
                                                textColor='#fff'
                                                keyboardType='numeric'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.mobile}
                                                onChangeText={handleChange('mobile')}
                                                onBlur={handleBlur('mobile')}
                                            />
                                            {touched.mobile && errors.mobile && (
                                                <Text style={styles.errorText}>{errors.mobile}</Text>
                                            )}
                                        </View>

                                        <View style={styles.formGroup}>
                                            <TextInput
                                                mode="flat"
                                                placeholder="Company Details*"
                                                style={styles.formControl}
                                                underlineColor="#fff"
                                                placeholderTextColor="#9F9F9F"
                                                textColor='#fff'
                                                theme={{
                                                    colors: {
                                                        primary: '#FF5400',
                                                    },
                                                }}
                                                value={values.companyDetails}
                                                onChangeText={handleChange('companyDetails')}
                                                onBlur={handleBlur('companyDetails')}
                                            />
                                            {touched.companyDetails && errors.companyDetails && (
                                                <Text style={styles.errorText}>{errors.companyDetails}</Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.step2}>
                                        <Text style={styles.sectionTitle}>2. Attachments</Text>
                                        <Card style={styles.cardItemMain}>
                                            <View style={styles.bulletText}>
                                                <Text style={styles.bulletT}>{'\u2022'}</Text>
                                                <Text style={styles.textB}> Only .Pdf,.Jpg,.Jpeg,.Png Files Are Allowed</Text>
                                            </View>

                                            <View style={styles.bulletText}>
                                                <Text style={styles.bulletT}>{'\u2022'}</Text>
                                                <Text style={styles.textB}>Please Refer The Sample Documents Before
                                                    Attaching The Documents. Invalid Documents Will Be Rejected After The
                                                    Registration Process.</Text>
                                            </View>

                                            <View style={styles.bulletText}>
                                                <Text style={styles.bulletT}>{'\u2022'}</Text>
                                                <Text style={styles.textB}>For More Than One Truck, Please Upload All Truck License
                                                    Document In A Single PDF File As Shown In The Sample Below. Missing A
                                                    Document Will Result To Rejection Of The Registration After Payment.</Text>
                                            </View>

                                        </Card>

                                        <Text style={styles.labelFile}>Company License Document *</Text>
                                        <Card style={styles.chooseFileCard}>
                                            <Button mode="elevated" textColor="#000" style={styles.chooseFileBt} onPress={() => openSheetForField('companylicensedocument', setFieldValue)}>Choose File</Button>
                                            <View style={styles.uploadFileName}>
                                                <Image style={styles.fileIcon} source={require('../../assets/images/download-icon.png')} />
                                                <Text style={styles.fileName}>
                                                    Download sample company license document

                                                </Text>
                                            </View>
                                            <Text style={styles.fileName}>{values.companylicensedocument?.name ?? 'No file selected'}</Text>

                                        </Card>

                                        <Text style={styles.labelFile}>Company Document *</Text>
                                        <Card style={styles.chooseFileCard}>
                                            <Button mode="elevated" textColor="#000" style={styles.chooseFileBt} onPress={() => openSheetForField('companydocument', setFieldValue)}>Choose File</Button>
                                            <View style={styles.uploadFileName}>
                                                <Image style={styles.fileIcon} source={require('../../assets/images/download-icon.png')} />
                                                <Text style={styles.fileName}>Download sample company license document</Text>
                                            </View>
                                            <Text style={styles.fileName}>{values.companydocument?.name ?? 'No file selected'}</Text>

                                        </Card>

                                        <Text style={styles.labelFile}>Truck Licence Documents (PDF Only) *</Text>
                                        <Card style={styles.chooseFileCard}>
                                            <Button mode="elevated" textColor="#000" style={styles.chooseFileBt} onPress={async () => {
                                                const picked = await chooseDocuments(true); // << PDF only
                                                if (picked) setFieldValue('trucklicensedocument', picked);
                                            }}>Choose File</Button>
                                            <View style={styles.uploadFileName}>
                                                <Image style={styles.fileIcon} source={require('../../assets/images/download-icon.png')} />
                                                <Text style={styles.fileName}>Download sample company license document</Text>
                                            </View>
                                            <Text style={styles.fileName}>{values.trucklicensedocument?.name ?? 'No file selected'}</Text>

                                        </Card>

                                        <View style={styles.buttonRow}>
                                            <Button mode="outlined" textColor="#FF5A00" style={styles.clearBt} onPress={() => handleSubmit()}>
                                                Save
                                            </Button>
                                            <Button mode="outlined" textColor="#fff" style={styles.clearBt}
                                                onPress={() => {
                                                    setFieldValue('companylicensedocument', null);
                                                    setFieldValue('companydocument', null);
                                                    setFieldValue('trucklicensedocument', null);
                                                }}
                                            >Clear Fields</Button>
                                        </View>
                                    </View>
                                    {confirmSubmit &&
                                    <View style={styles.step3}>
                                        <Text style={styles.sectionTitle}>3. Summary</Text>
                                        <Card style={styles.cardItemMain}>
                                            <View style={styles.summaryBlock}>
                                                <Text style={styles.summaryLabel}>Truck Count :</Text>
                                                <Text style={styles.summaryText}>1101</Text>
                                            </View>

                                            <View style={styles.summaryBlock}>
                                                <Text style={styles.summaryLabel}>Total Amount To Pay :</Text>
                                                <Text style={styles.summaryText}>4440 AED</Text>
                                            </View>
                                        </Card>
                                    </View>
                                    }


                                </View>
                                {Platform.OS === 'android' && androidSheetVisible && (
                                    <RNModal visible transparent animationType="fade">
                                        <Pressable style={styles.backdrop} onPress={() => setAndroidSheetVisible(null)} />
                                        <View style={styles.sheet}>
                                            <Text style={styles.sheetTitle}>Select Source</Text>
                                            <Pressable
                                                style={styles.item}
                                                onPress={async () => {
                                                    const picked = await chooseCamera();
                                                    if (picked) setFieldValue(androidSheetVisible.field, picked);
                                                    setAndroidSheetVisible(null);
                                                }}
                                            >
                                                <Text style={styles.itemText}>Camera</Text>
                                            </Pressable>
                                            <Pressable
                                                style={styles.item}
                                                onPress={async () => {
                                                    const picked = await chooseGallery();
                                                    if (picked) setFieldValue(androidSheetVisible.field, picked);
                                                    setAndroidSheetVisible(null);
                                                }}
                                            >
                                                <Text style={styles.itemText}>Gallery</Text>
                                            </Pressable>
                                            <Pressable
                                                style={styles.item}
                                                onPress={async () => {
                                                    const pdfOnly = androidSheetVisible.field === 'trucklicensedocument';
                                                    const picked = await chooseDocuments(pdfOnly);
                                                    if (picked) setFieldValue(androidSheetVisible.field, picked);
                                                    setAndroidSheetVisible(null);
                                                }}
                                            >
                                                <Text style={styles.itemText}>
                                                    Documents{androidSheetVisible.field === 'trucklicensedocument' ? ' (PDF only)' : ''}
                                                </Text>
                                            </Pressable>
                                            <Pressable style={[styles.item, styles.cancel]} onPress={() => setAndroidSheetVisible(null)}>
                                                <Text style={[styles.itemText, styles.cancelText]}>Cancel</Text>
                                            </Pressable>
                                        </View>
                                    </RNModal >
                                )}
                            </View>
                        </ScrollView >
                    )}
                </Formik>
                {confirmSubmit &&                 
                <View style={styles.footerAbsolute}>
                    <View style={styles.buttonRow}>
                        <Button mode="contained" style={styles.closeButton} textColor="#000">Cancel</Button>
                        <Button onPress={() => setConfirmVisible(true)} mode="contained" buttonColor="#FF5A00" style={styles.applyButton}>Next</Button>

                        <Portal>
                            <PaperModal
                                visible={confirmVisible}
                                onDismiss={() => setConfirmVisible(false)}
                                contentContainerStyle={styles.confirmAlert}
                            >
                                <View style={styles.confirmAlert}>
                                    <Text style={{ fontSize: 19, textAlign: 'center', color: '#fff', marginBottom: 20 }}>
                                        Are you sure?
                                    </Text>
                                    <Icon source="alert" size={20} />
                                    <Text style={{ fontSize: 14, textAlign: 'center', color: '#fff', marginBottom: 20 }}>
                                        The data and attachments will be saved. You won't be able to update after saving.
                                    </Text>
                                    <View style={styles.buttonRow}>
                                        <Button mode="contained" style={styles.closeButton} textColor="#000" onPress={() => setConfirmVisible(false)}>
                                            Cancel
                                        </Button>
                                        <Button mode="contained" buttonColor="#FF5A00" style={styles.applyButton}>
                                            Next
                                        </Button>
                                    </View>
                                </View>
                            </PaperModal>
                        </Portal>
                    </View>
                </View> }

            </PaperProvider>
        </ImageBackground>

    );
};
export default AddVehicle;
const styles = StyleSheet.create({
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
        marginHorizontal: 20,
        marginTop: 10,

    },

    innerContainerPad: {
        paddingBottom: 70,
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
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontFamily: 'Poppins-Medium',
    },

    labelFile: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 14,
        color: '#fff',
        fontWeight: 'normal',
        fontFamily: 'Poppins-Regular',
    },


    formGroup: { marginTop: 10, marginBottom: 15, },
    formControl: {
        paddingHorizontal: 0,
        height: 38,
        borderBottomColor: '#FCFCFC',
        borderBottomWidth: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },

    formLabel: { color: '#fff', fontSize: 13, marginBottom: 10, },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    applyButton: {
        paddingTop: 0,
        paddingBottom: 3,
        color: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 0,
        fontSize: 13,
        marginHorizontal: 10,
        width: 130,


    },

    closeButton: {
        width: 130,
        paddingTop: 0,
        paddingBottom: 3,
        backgroundColor: '#FFFFFF',
        color: '#000',
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 0,
        fontSize: 13,
        marginHorizontal: 10,
    },

    step1: {

    },

    step2: {},
    step3: {},
    cardItemMain: {
        borderWidth: 0,
        paddingVertical: 15,
        marginTop: 0,
        marginHorizontal: 0,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },
    bulletText: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    bulletT: {
        fontSize: 23,
        color: '#FF5400',
        lineHeight: 22,
    },
    textB: {
        fontSize: 14,
        color: '#FF5400',
        lineHeight: 22,
        fontWeight: 400,
        paddingLeft: 5,
        paddingRight: 10,
    },

    uploadFileName: {
        paddingLeft: 0,
        paddingRight: 10,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    fileIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    fileName: {
        fontSize: 14,
        color: '#FF5400',
        lineHeight: 22,
        fontWeight: 400,
        paddingLeft: 5,
        paddingRight: 10,
        fontFamily: 'Poppins-Regular',
    },
    chooseFileBt: {
        width: 150,
        fontFamily: 'Poppins-Regular',

        marginBottom: 15,
        borderRadius: 10,
    },

    chooseFileCard: {
        borderWidth: 0,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 0,
        marginHorizontal: 0,
        marginBottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        shadowOpacity: 0,
        elevation: 0,
    },

    clearBt: {
        borderColor: '#FF5400',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 150,
        borderRadius: 60,
        paddingVertical: 5,
        fontFamily: 'Poppins-Regular',
    },

    summaryBlock: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        marginBottom: 10,
    },

    summaryText: {
        color: '#fff',
        fontSize: 14,

    },

    summaryLabel: {
        color: '#fff',
        fontSize: 14,
        width: 180,
    },

    confirmAlert: {
        backgroundColor: '#000',
        paddingHorizontal: 25,
        marginHorizontal: 20,
        borderRadius: 20,
        color: '#fff',
        paddingTop: 30,
        paddingBottom: 40,
    },

    sectionTitleModal: {
        marginVertical: 20,
        fontSize: 17,
        color: '#fff',
        fontWeight: 'normal',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    //chatgpt styles
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    buttonText: { color: 'white', fontWeight: '600' },
    backdrop: {
        flex: 1,
        backgroundColor: '#00000055',
    },
    sheet: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 8,
        elevation: 6,
    },
    sheetTitle: {
        fontWeight: '700',
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    itemText: {
        fontSize: 15,
    },
    cancel: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eee',
    },
    cancelText: {
        color: '#888',
    }
});