import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import HomeScreen from '.';

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleContinue = () => {
    console.log('Continue pressed with code:', verificationCode);
    if (verificationCode == "1234"){
        return (
            <HomeScreen/>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>We have sent you a code for verification.</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📱</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setVerificationCode}
            value={verificationCode}
            placeholder="Enter code"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    paddingBottom: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 18,
  },
  iconContainer: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 40,
  },
  icon: {
    fontSize: 15,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#8DBA76',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Verification;