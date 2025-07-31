import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserType } from './Users';


export function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const navigation = useNavigation();

const handleLogin = async () => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore'dan kullanıcı profilini oku
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const profileData = userDoc.data();
      // Kullanıcıyı local storage'a kaydet
      await AsyncStorage.setItem('currentUser', JSON.stringify({
        fullName: profileData.fullName,
        email: profileData.email,
        userUid: profileData.userUid,
      }));
      navigation.navigate("Users", { User: profileData as UserType });
    } else {
      Alert.alert('Hata', 'Kullanıcı profili bulunamadı.');
    }
  } catch (error: any) {
    console.error('Giriş hatası:', error);
    Alert.alert('Giriş Hatası', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LET'S CHAT</Text>
      <Text style={styles.subtitle}>Join the chat and start messaging</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text></Button>
    
      <Button style={styles.button} screen="Join"> 
        <Text style={styles.buttonText}>Join if you can!</Text></Button>
    </View>
  );
}
const styles = StyleSheet.create({
title:{
  fontSize:22,
  fontWeight:'bold',
  marginBottom:10,
  color:'#3E5F44'
},
subtitle:{
  fontSize:17,
  marginBottom:10,
  color:'#004030'
},
label:{
  fontSize:15,
  fontWeight:'bold',
  marginBottom:5,
  color:'#0A400C'
},  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  button:{
    width:'80%',
    padding:10,
    backgroundColor:'#0A400C',
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    
  },
  buttonText:{
    color:'#fff',
    fontSize:15,
    fontWeight:'bold'
  }
});