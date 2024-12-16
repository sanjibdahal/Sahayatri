import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from 'expo-router';

import "../global.css";

export default function HomeScreen() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={{ width: '100%', height: 250, backgroundColor: 'red' }}>
                    <ImageBackground source={require('@/assets/images/car.png')} style={styles.backgroundImage}>
                        <LinearGradient colors={['transparent', 'rgba(255,255,255,1)']} style={styles.gradient} />
                    </ImageBackground>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                    <Text className="color-purple-500 text-4xl font-plusjakartasans">Let's get started hh!</Text>
                    <Link href="/profile">Go to Profile Section</Link>
                    <Text className="text-4xl color-purple-700 ">Hello </Text>
                </View>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 250,
        width: '100%',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
        width: '100%',
    },
    titleContainer: {

    },
    titleText: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
    }
});