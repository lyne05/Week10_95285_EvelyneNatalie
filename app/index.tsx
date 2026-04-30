import * as Location from "expo-location";
import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region, UrlTile } from "react-native-maps";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const { height } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState<Coordinates | null>(null);

  const getLocation = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission denied! Please allow location access.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const region: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {!location ? (
        <Button title="Get Geo Location" onPress={getLocation} />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={(e) =>
              setLocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }
          >
            <UrlTile
              {...({
                //sudah pakai link di dc tapi masih access blocked
                urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                additionalHeaders: { "User-Agent": "MyApp/1.0" },
                maximumZ: 19,
              } as any)}
            />

            <Marker
              coordinate={location}
              title="My Location"
              draggable
              onDragEnd={(e) =>
                setLocation({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                })
              }
            />
          </MapView>

          <View style={styles.info}>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Button title="Refresh Location" onPress={getLocation} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: height * 0.5,
    width: "100%",
  },
  info: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
