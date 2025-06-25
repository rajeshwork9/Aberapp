import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, TextInput,Image } from 'react-native';
import { Button, Text, Checkbox } from 'react-native-paper';
  import { SelectCountry } from 'react-native-element-dropdown';

  const local_data = [
    {
      value: '1',
      lable: 'EN',
      image: {
        uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
      },
    },
    {
      value: '2',
      lable: 'AE',
      image: {
        uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
      },
    },

  ];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [captcha, setCaptcha] = useState('');
  const [checked, setChecked] = React.useState(false);
   const [country, setCountry] = useState('1');

  const handleLogin = () => {
    console.log('Logging in:', email, password, captcha);
  };

  const validate = () => {
    if (!email) {
      setError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
    } else {
      setError('');
      // submit form
    }
  };


  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
  

     <SelectCountry
        style={styles.countryDropdown}
        selectedTextStyle={styles.selectedTextContry}
        placeholderStyle={styles.placeholderCountry}
        imageStyle={styles.imageCountry}
        // inputSearchStyle={styles.inputSearchCountry}
        iconStyle={styles.iconCountry}
        // search
        maxHeight={200}
        value={country}
        data={local_data}
        valueField="value"
        labelField="lable"
        imageField="image"
        placeholder="Select country"
        containerStyle={styles.dropdownList}  
        activeColor="#333333"
        // searchPlaceholder="Search..."
        onChange={e => {
          setCountry(e.value);
        }}
      />

        <View style={styles.innerContainer}>
          <ImageBackground source={require('../../assets/images/logo.png')} style={styles.logoImage} ></ImageBackground>
          <Text variant="headlineMedium" style={styles.title}>
            Login with Account
          </Text>
          

          <View style={styles.formViewGroup}>
            <TextInput style={styles.formInput} placeholder="Email" placeholderTextColor="#aaa"
              value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" />
            <ImageBackground source={require('../../assets/images/email-icon.png')} style={styles.formInputIcon} ></ImageBackground>
             {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
          </View>


          <View style={styles.formViewGroup}>
            <TextInput style={styles.formInput} placeholder="Password" placeholderTextColor="#aaa"
             value={password}onChangeText={setPassword}
              secureTextEntry
            />
            <ImageBackground source={require('../../assets/images/password-icon.png')} style={styles.formInputIcon} ></ImageBackground>
           {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
          </View>

          <Text style={styles.forgotLink}>Forgot password?</Text>

          <View style={styles.formViewGroup}>
            <TextInput style={styles.formInput} placeholder="Enter Captcha" placeholderTextColor="#aaa"
              secureTextEntry
            />

<Button style={styles.refreshBt} onPress={() => console.log('Pressed')}>
   <Text style={{color:'#fff',position:'relative',top:-6,height:20, fontSize:12,}}>123456 
     <Image style={{width:20, height:14,  }} source={require('../../assets/images/refresh-icon.png')} />
   </Text>
  </Button>
             {/* <Button mode="contained" style={styles.refreshBt}>123456  <ImageBackground source={require('../../assets/images/refresh-icon.png')} style={styles.refreshIcon} ></ImageBackground></Button> */}
          
          
            <ImageBackground source={require('../../assets/images/captcha-icon.png')} style={styles.formInputIcon} ></ImageBackground>
          </View>

            <View style={styles.cboxStyle}>
            <Checkbox
              color="#fff"
              uncheckedColor="#fff" // Custom color for unchecked box
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
             <Text style={styles.cboxlabel}>Save Password</Text>
            </View>

          <Button mode="contained" style={styles.primaryBt} onPress={validate}>
            Login
          </Button>
        </View>

         <ImageBackground source={require('../../assets/images/loginbottom-img.png')} style={styles.loginBottomImg} ></ImageBackground>
      </View>
    </ImageBackground>
  );
};

export default Login;
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',

    marginTop:30,
  },

  logoImage: {
    marginHorizontal: 'auto',
    marginTop: 0,
    width: 202,
    height: 44,
    justifyContent: 'space-between',

  },

  innerContainer: {
    position:'relative',
    zIndex:1,
    paddingLeft: 10,
    paddingRight: 10,
        paddingTop: 10,
    paddingBottom: 20,
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 15,
    color: '#fff',
    paddingLeft:10,
  },

  formViewGroup:{
    marginBottom:15,
  },
  
  formInput: {
    height: 45,
    borderColor: '#ddd',
    borderRadius: 40,
    paddingRight: 20,
    paddingLeft: 45,
    marginTop: 0,
    fontSize: 13,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: '#1C1C1C'
  },

  formInputIcon: {
    width: 13,
    height: 13,
    position: 'absolute',
    top: 17,
    left: 20,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'right',
    marginBottom: 20,
    color: '#fff',
  },

  errorMessage:{
    color:'#FFACAC',
    marginBottom: 5,
  },

  cboxStyle:{
    position:'relative',
    marginTop:0,
     marginBottom:15,
  },

  cboxlabel: {
    color: '#fff',
    position: 'absolute',
    left:40,
    top:7,
    fontSize:13,
  },

loginBottomImg:{
  position:'absolute',
  width:'100%',
  height:170,  
  bottom:0,
   resizeMode:'cover',

},

  primaryBt: {
    borderRadius: 40,
  },

  refreshBt:{
      width:105,
      backgroundColor:'#02152D',
     borderWidth:1,
    borderStyle:'solid',
    borderColor:'#fff',
    borderRadius:40,
    height:33,
lineHeight:16,
    position:'absolute',
    right:6,
    top:6,
    display:'flex',
    alignItems:'center',
    justifyContent: 'space-between',
  },


  // Select

  countryDropdown: {
    width:90,
      marginBottom:20,
      marginHorizontal:20,
      height:30,
     backgroundColor: '#000000',
     borderRadius:30,
     color:'#fff',
     paddingHorizontal:12,
     alignSelf: 'flex-end'

      

    },
    imageCountry: {
      width:16,
      height:16,
        color:'#fff',
    },
    placeholderCountry: {
      fontSize: 14,
       color:'#fff',
    },
    selectedTextContry: {
      fontSize: 12,
      marginLeft: 8,
       color:'#fff',
       
      
    },
    iconCountry: {
      width: 13,
      height: 13,
      backgroundColor:'#000',
      
    },
    inputSearchCountry: {
      height: 40,
      fontSize: 16,
      backgroundColor:'#000',
      
    },

    dropdownList: {
    backgroundColor: '#000', 
    color:'#fff',
    borderColor:'#000',
    borderRadius:4,
  
  },



});
