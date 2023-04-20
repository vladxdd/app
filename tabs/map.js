import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import places from './places.json';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null); //state to store the selected place
  const mapRef = useRef(null); // reference to the map component
  const [selectedCountry, setSelectedCountry] = useState('all'); //state to store the selected country
  const countries = Array.from(new Set(places.map((place) => place.country.toLowerCase()))); //get unique list of countries from the places array
  const [searchText, setSearchText] = useState("");
  const handleTextChange = (text) => {
    setSearchText(text);
  };

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

  const handleSearch = () => {
    const filteredPlaces = places.filter(place => {
      const searchTextLC = searchText.toLowerCase();
      const nameLC = place.name.toLowerCase();
      const addressLC = place.address.toLowerCase();
      return nameLC.includes(searchTextLC) || addressLC.includes(searchTextLC);
    });
    console.log(filteredPlaces); // log the filtered places to console
    // your code to do something with the filtered places
  };

  const handleMarkerPress = (place) => {
    if (place.name === selectedPlace) {
      setSelectedPlace(null); // deselect the selected place if the same marker is clicked again
    } else {
      mapRef.current.animateToRegion({
        latitude: place.coordinates.latitude,
        longitude: place.coordinates.longitude,
        latitudeDelta: 0.0082,
        longitudeDelta: 0.0081,
      }, 1000); // move the map to center on the selected marker's location
      setSelectedPlace(place.name); // set the selected place name in state
      setTimeout(() => setSelectedPlace(null), 30000); // delay clearing the selected place state for a long time
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
        }, 1000); // move the map to center on the selected country's location
      }
    } else {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0592,
        longitudeDelta: 0.0591,
      }, 1000); // move the map back to the initial location
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View style={styles.switchContainer}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country}
              style={[
                styles.switchButton,
                selectedCountry === country && styles.selectedSwitchButton,
              ]}
              onPress={() => handleSwitchCountry(country)}
            >
              <Text style={[styles.switchButtonText, selectedCountry === country && styles.selectedSwitchButtonText]}>
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
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={() => setSelectedPlace(null)}
        >
          {/* Add circle for user's current location */}
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={100}
            fillColor="rgba(0, 0, 255, 0.1)"
            strokeColor="blue"
            strokeWidth={2}
          />
          {places
            .filter((place) => selectedCountry === 'all' || place.country.toLowerCase() === selectedCountry)
            .map((place, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: place.coordinates.latitude, longitude: place.coordinates.longitude }}
                pinColor={place.country === 'moldova' ? 'green' : 'blue'}
                onPress={() => handleMarkerPress(place)}
              >
                {selectedPlace === place.name && (
                  <View style={styles.markerContainer}>
                    <Text style={styles.markerText}>{place.name + "\nDescription: " + place.description}</Text>
                  </View>
                )}
              </Marker>
            ))}
        </MapView>
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