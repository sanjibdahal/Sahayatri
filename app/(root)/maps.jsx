import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Locations } from './locations';
import RouteMap from './RouteMap';

export default function Maps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [currentPlace, setCurrentPlace] = useState('Fetching location...');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');

      if (status === 'granted') {
        await updateUserLocation();
      } else {
        console.log('Location permission not granted');
        setCurrentPlace('Location unavailable');
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = Locations.filter(
        location => location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [searchQuery]);

  const updateUserLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({}); // Users current location
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setUserLocation(newRegion);
      setRegion(newRegion);
      
      const closest = findClosestLocation(newRegion);
      if (closest) {
        setCurrentPlace(closest.name);
      } else {
        setCurrentPlace('Current Location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentPlace('Location error');
    }
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    const closest = findClosestLocation(newRegion);
    if (closest) {
      setCurrentPlace(closest.name);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setDestination(location);
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0121,
    });
    setCurrentPlace(location.name);
    setSearchQuery('');
    setFilteredLocations([]);
  };

  const findClosestLocation = (region) => {
    return Locations.reduce((closest, location) => {
      const distance = Math.sqrt(
        Math.pow(location.latitude - region.latitude, 2) +
        Math.pow(location.longitude - region.longitude, 2)
      );
      return closest == null || distance < closest.distance
        ? { ...location, distance }
        : closest;
    }, null);
  };

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >

        {selectedLocation && (
          <Marker 
            coordinate={{ 
              latitude: selectedLocation.latitude, 
              longitude: selectedLocation.longitude 
            }} 
          />
        )}
      </MapView>

      <RouteMap 
        userLocation={userLocation}
        destination={destination}
      />
      
      <View style={styles.locationBoxesContainer}>
        <View style={styles.locationBox}>
          <Text style={styles.locationBoxTitle}>Current Location</Text>
          <Text style={styles.locationBoxText}>{currentPlace}</Text>
        </View>
        <View style={styles.locationBox}>
          <Text style={styles.locationBoxTitle}>Destination</Text>
          <Text style={styles.locationBoxText}>
            {destination ? destination.name : 'Not set'}
          </Text>
        </View>
      </View>

      {/*}
      <TouchableOpacity style={styles.menuButton}>
        <Feather name="menu" size={24} color="black" />
      </TouchableOpacity>
      */}

      <TouchableOpacity 
        style={styles.gpsButton} 
        onPress={updateUserLocation}
      >
        <Feather name="navigation" size={24} color="black" />
      </TouchableOpacity>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <FlatList
          data={filteredLocations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.suggestionItem}
              onPress={() => handleLocationSelect(item)}
            >
              <View style={styles.iconContainer}>
                <Feather name="map-pin" size={20} color="gray" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationAddress}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationBoxesContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    marginHorizontal: 5,
  },
  locationBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
  locationBoxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 110,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  gpsButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  searchContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationAddress: {
    fontSize: 14,
    color: 'gray',
  },
});