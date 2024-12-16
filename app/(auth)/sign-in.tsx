import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import { Stack } from 'expo-router';

const SignIn = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        // Add sign-in logic here
        console.log('Sign In button pressed');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: 'Sign In'}} />
            <Text style={styles.title}>Sahayatri - Sign In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Sign In" onPress={handleSignIn} />
            <Text style={styles.signUpText} onPress={() => navigation.navigate('SignUp')}>
                Don't have an account? Sign Up
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    signUpText: {
        marginTop: 16,
        color: 'blue',
        textAlign: 'center',
    },
});

export default SignIn;