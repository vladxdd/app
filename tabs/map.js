import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import places from './places.json'; //import JSON containing places and coordinates

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null); //state to store the selected place
  const mapRef = useRef(null); // reference to the map component
  const [selectedCountry, setSelectedCountry] = useState('all'); //state to store the selected country

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
      setSelectedPlace(null); // deselect the selected place if the same marker is clicked again
    } else {
      setSelectedPlace(place.name); // set the selected place to show its name on top of the map
      mapRef.current.animateToRegion({
        latitude: place.coordinates.latitude,
        longitude: place.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000); // move the map to center on the selected marker's location
    }
  };

  const handleSwitchCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <TouchableOpacity style={[styles.switchButton, selectedCountry === 'all' && styles.selectedSwitchButton]} onPress={() => handleSwitchCountry('all')}>
          <Text style={[styles.switchButtonText, selectedCountry === 'all' && styles.selectedSwitchButtonText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchButton, selectedCountry === 'usa' && styles.selectedSwitchButton]} onPress={() => handleSwitchCountry('usa')}>
          <Text style={[styles.switchButtonText, selectedCountry === 'usa' && styles.selectedSwitchButtonText]}>USA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchButton, selectedCountry === 'canada' && styles.selectedSwitchButton]} onPress={() => handleSwitchCountry('canada')}>
          <Text style={[styles.switchButtonText, selectedCountry === 'canada' && styles.selectedSwitchButtonText]}>Canada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchButton, selectedCountry === 'moldova' && styles.selectedSwitchButton]} onPress={() => handleSwitchCountry('moldova')}>
          <Text style={[styles.switchButtonText, selectedCountry === 'moldova' && styles.selectedSwitchButtonText]}>Moldova</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchButton, selectedCountry === 'bulgaria' && styles.selectedSwitchButton]} onPress={() => handleSwitchCountry('bulgaria')}>
          <Text style={[styles.switchButtonText, selectedCountry === 'bulgaria' && styles.selectedSwitchButtonText]}>Bulgaria</Text>
        </TouchableOpacity>
      </View>
      {location && (
        <MapView
          ref={mapRef} // set the reference to the map component
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={() => setSelectedPlace(null)} // deselect the selected place on map move
        >
          {places.filter(place => selectedCountry === 'all' || place.country.toLowerCase() === selectedCountry).map((place, index) => ( //map over the places and coordinates in the JSON, filter by selected country
            <Marker
              key={index}
              coordinate={{ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude }}
              pinColor={place.country === 'moldova' ? 'green' : 'blue'} //set marker color to blue, except for Moldova, which is green
              onPress={() => handleMarkerPress(place)}
            >
              {selectedPlace === place.name && (
                <View style={styles.markerContainer}>
                  <Text style={styles.markerText}>{place.name}</Text>
                </View>
              )}
            </Marker>
          ))}
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  markerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
  },
  markerText: {
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  selectedSwitchButton: {
    backgroundColor: '#2196F3',
  },
  switchButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  selectedSwitchButtonText: {
    color: '#fff',
  },
});