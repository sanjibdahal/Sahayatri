import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUp = () => {
    const [isRider, setIsRider] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        vehicleDetails: '',
    });

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        // Handle form submission logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up as {isRider ? 'Rider' : 'User'}</Text>
            <View style={styles.toggleRole}>
                <Button title="Rider" onPress={() => setIsRider(true)} />
                <Button title="User" onPress={() => setIsRider(false)} />
            </View>
            <View style={styles.form}>
                <Text>Name</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => handleChange('name', value)}
                />
                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                    keyboardType="email-address"
                />
                <Text>Password</Text>
                <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(value) => handleChange('password', value)}
                    secureTextEntry
                />
                <Text>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleChange('confirmPassword', value)}
                    secureTextEntry
                />
                {isRider && (
                    <>
                        <Text>Vehicle Details</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.vehicleDetails}
                            onChangeText={(value) => handleChange('vehicleDetails', value)}
    
                        />
                    </>
                )}
                <Button title="Sign Up" onPress={handleSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    toggleRole: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    form: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default SignUp;