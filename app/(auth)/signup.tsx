import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';

import {supabase } from "@/lib/supabase"

export default function SignUp({ navigation }: any) {
    const [step, setStep] = useState<'signup' | 'otp' | 'upload'>('signup');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        otp: '',
    });
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async () => {
        setLoading(true);
        try {
            // Integrate with SMS service provider here
            setStep('otp');
        } catch (err) {
            setError('Failed to send OTP');
        }
        setLoading(false);
    };

    const verifyOTP = async () => {
        setLoading(true);
        try {
            // Verify OTP here
            setStep('upload');
        } catch (err) {
            setError('Invalid OTP');
        }
        setLoading(false);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePhoto(result.assets[0].uri);
        }
    };

    const handleImageUpload = async () => {
        if (!profilePhoto) return;

        setLoading(true);
        try {
            const response = await fetch(profilePhoto);
            const blob = await response.blob();

            const fileExt = profilePhoto.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;

            const { data: imageData, error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, blob);

            if (uploadError) throw uploadError;

            const { error: insertError } = await supabase.from('profiles').insert({
                name: formData.name,
                phone: formData.phone,
                profile_photo_url: imageData?.path,
            });

            if (insertError) throw insertError;

            navigation.navigate('Dashboard');
        } catch (err) {
            setError('Failed to complete signup');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {step === 'signup' && (
                <View style={styles.form}>
                    <TextInput
                        placeholder="Full Name"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        placeholder="Password"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        style={styles.input}
                        secureTextEntry
                    />
                    <TouchableOpacity 
                        onPress={handleSignup}
                        style={styles.button}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Sending OTP...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 'otp' && (
                <View style={styles.form}>
                    <TextInput
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChangeText={(text) => setFormData({ ...formData, otp: text })}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity 
                        onPress={verifyOTP}
                        style={styles.button}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === 'upload' && (
                <View style={styles.form}>
                    {profilePhoto && (
                        <Image 
                            source={{ uri: profilePhoto }}
                            style={{ width: 200, height: 200, alignSelf: 'center' }}
                        />
                    )}
                    <TouchableOpacity 
                        onPress={pickImage}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Pick an image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={handleImageUpload}
                        style={styles.button}
                        disabled={loading || !profilePhoto}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Completing Signup...' : 'Complete Signup'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    form: {
        gap: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    }
});