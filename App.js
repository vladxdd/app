import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './tabs/home';
import Map from './tabs/map';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: () => (
              <Image
                source={{ uri: 'https://www.pngkey.com/png/full/15-159372_home-icon-png-white-graphic-transparent-download-home.png' }}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: () => (
              <Image
                source={{ uri: 'https://toppng.com//public/uploads/preview/royalty-free-stock-maps-icon-free-download-png-white-google-map-ico-115629001883xm3bupqk9.png' }}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}