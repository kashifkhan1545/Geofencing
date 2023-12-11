import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Linking } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: 30.04657135362574,
    longitude: 70.64823536124274,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState(initialRegion);

  const polygonCoordinates = [
    { latitude: initialRegion.latitude + 0.05, longitude: initialRegion.longitude - 0.05 },
    { latitude: initialRegion.latitude - 0.05, longitude: initialRegion.longitude - 0.05 },
    { latitude: initialRegion.latitude - 0.05, longitude: initialRegion.longitude + 0.05 },
    { latitude: initialRegion.latitude + 0.05, longitude: initialRegion.longitude + 0.05 },
  ];

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            () => {
              Geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setInitialRegion((prevRegion) => ({
                    ...prevRegion,
                    latitude,
                    longitude,
                  }));
                },
                (error) => console.log('Error getting location:', error),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
              );
            },
            (error) => {

              Alert.alert(
                'Location Services Disabled',
                'Please enable location services to use this app.',
                [
                  {
                    text: 'Open Settings',
                    onPress: () => Linking.openSettings(),
                  },
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                ],
                { cancelable: false },
              );
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
        } else {
          Alert.alert('Location Permission Denied', 'Please enable location to use this app.');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  const isMarkerInsidePolygon = (markerCoord, polyCoords) => {
    const x = markerCoord.latitude;
    const y = markerCoord.longitude;

    let inside = false;
    for (let i = 0, j = polyCoords.length - 1; i < polyCoords.length; j = i++) {
      const xi = polyCoords[i].latitude;
      const yi = polyCoords[i].longitude;
      const xj = polyCoords[j].latitude;
      const yj = polyCoords[j].longitude;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setMarkerCoordinate(coordinate);

    if (isMarkerInsidePolygon(coordinate, polygonCoordinates)) {
      Alert.alert('Alert', 'You are inside the geo-fencing region!');
    } else {
      Alert.alert('Alert', 'You are outside the geo-fencing region!');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={markerCoordinate}
          title="Marker Title"
          description="Marker Description"
          draggable
        />
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="red"
          fillColor="rgba(0, 0, 255, 0.2)"
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
