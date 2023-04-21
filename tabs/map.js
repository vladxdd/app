import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import places from './places.json';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [setErrorMsg] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const countries = [...new Set(places.map((place) => place.country.toLowerCase()))];
  const [cameraView, setCameraView] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = (place) => {
    if (place.name === selectedPlace) {
      setSelectedPlace(null);
    } else {
      mapRef.current.animateToRegion({
        latitude: place.coordinates.latitude,
        longitude: place.coordinates.longitude,
        latitudeDelta: 0.0082,
        longitudeDelta: 0.0081,
      }, 1000);
      setSelectedPlace(place.name);
      setTimeout(() => setSelectedPlace(null), 30000);
    }
  };

  const handleSwitchCountry = (country) => {
    setSelectedCountry(country);
    if (country !== 'all') {
      const countryPlaces = places.filter(place => place.country.toLowerCase() === country);
      if (countryPlaces.length > 0) {
        const countryCoords = countryPlaces[0].coordinates;
        mapRef.current.animateToRegion({
          latitude: countryCoords.latitude,
          longitude: countryCoords.longitude,
          latitudeDelta: 4,
          longitudeDelta: 4,
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              selectedCountry === 'all' && styles.selectedSwitchButton,
            ]}
            onPress={() => handleSwitchCountry('all')}
          >
            <Text
              style={[
                styles.switchButtonText,
                selectedCountry === 'all' && styles.selectedSwitchButtonText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {countries.map((country) => (
            <TouchableOpacity
              key={country}
              style={[
                styles.switchButton,
                selectedCountry === country && styles.selectedSwitchButton,
              ]}
              onPress={() => handleSwitchCountry(country)}
            >
              <Text
                style={[
                  styles.switchButtonText,
                  selectedCountry === country && styles.selectedSwitchButtonText,
                ]}
              >
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          onRegionChange={() => setSelectedPlace(null)}
        >
          {places
            .filter(
              (place) =>
                selectedCountry === 'all' ||
                place.country.toLowerCase() === selectedCountry
            )
            .map((place) => (
              <Marker
                key={place.name}
                coordinate={place.coordinates}
                onPress={() => handleMarkerPress(place)}
              >
                {selectedPlace === place.name && (
                  <View style={styles.markerContainer}>
                    <Text style={styles.markerText}>
                      {place.name} - {place.address}
                    </Text>
                  </View>
                )}
              </Marker>
            ))}
        </MapView>
      )}
      {cameraView && (
        <View style={styles.cameraView}>
          <MapView
            style={styles.cameraMap}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              draggable
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 10,
  },
  switchButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  selectedSwitchButton: {
    backgroundColor: '#3f51b5',
  },
  switchButtonText: {
    color: '#3f51b5',
  },
  selectedSwitchButtonText: {
    color: '#fff',
  },
  map: {
    width: '100%',
    height: '92.5%',
  },
  cameraView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  cameraCloseButton: {
    alignSelf: 'flex-end',
  },
  cameraMap: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: 'linear-gradient(to bottom, #ffffff, #f2f2f2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  markerText: {
    fontSize: 16,
  },
});