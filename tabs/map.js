import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'; 
import MapView, { Marker } from 'react-native-maps';
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
    }
  };

  const handleSwitchCountry = (country) => {
    setSelectedCountry(country);
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
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    width : '100%',
    height : '92.5%',
  },
  markerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  markerText: {
    fontSize: 16,
  },
  // no ussage
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  //  no ussage
  textInput: {
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  //  no ussage
  radioInputs: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //  no ussage
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  //  no ussage
  selectedRadioCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbb',
  },
  //  also no ussage
  radioText: {
    fontSize: 16,
    color: '#333',
  },
});