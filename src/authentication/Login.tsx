import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, TextInput } from 'react-native';
import { Button, Text, Checkbox } from 'react-native-paper';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [captcha, setCaptcha] = useState('');
  const [checked, setChecked] = React.useState(false);

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

<Button style={styles.refreshBt} icon="camera" onPress={() => console.log('Pressed')}>
   123456
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
    justifyContent: 'center',
  },

  logoImage: {
    marginHorizontal: 'auto',
    marginTop: 20,
    width: 202,
    height: 44,
    justifyContent: 'space-between',

  },

  innerContainer: {
    position:'relative',
    zIndex:1,
    padding: 10,
    paddingHorizontal: 20,
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
    borderWidth:1,
    borderStyle:'solid',
    borderColor:'#fff',
    borderRadius:40,
    paddingHorizontal:0,
    paddingLeft:0,
    paddingVertical:5,
    color:'#fff',
    width:100,
height:32,
    fontSize:10,
    lineHeight:2,

    position:'absolute',
    right:10,
    top:6,
    backgroundColor:'#02152D',
    fontWeight:'normal',

   

  },
  refreshIcon:{
        width: 13,
       height: 13,
       marginTop:2,
       paddingTop:2,
       

  }
});
