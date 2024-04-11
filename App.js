import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 테스트용 key
const API_KEY = '54b02482bc937fbe37e8fdf0392c7ae2';

// navy : #070034
// yellow: #feb90c
// light-sky: #92d9f5
// sky : #03b9f3

const icons = {
  Clouds: { icon: 'cloudy', color: '#03b9f3' },
  Rain: { icon: 'rains', color: '#03b9f3' },
  Clear: { icon: 'day-sunny', color: '#bc544b' },
  Snow: { icon: 'snow', color: '#fff' },
  Drizzel: { icon: 'rain', color: '#03b9f3' },
  atmosphere: { icon: 'cloudy-gusts', color: '#03b9f3' },
  Thunderstorm: { icon: 'lightning', color: '#feb90c' },
};

export default function App() {
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState('');
  const [days, setDays] = useState([]);

  const getWeather = async () => {
    let { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(`${location[0].city} ${location[0].district}`);

    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.8/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      );
      setDays(data.daily);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          days.map((day, idx) => {
            return (
              <View style={styles.day} key={idx}>
                <Fontisto
                  style={styles.icon}
                  name={icons[day.weather[0].main].icon}
                  color={icons[day.weather[0].main].color}
                />
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070034',
  },

  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cityName: {
    fontSize: 36,
    fontWeight: '600',
    color: '#feb90c',
  },

  weather: {
    color: '#fff',
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },

  temp: {
    fontSize: 160,
    marginTop: 50,
    color: '#fff',
  },

  description: {
    fontSize: 80,
    marginTop: -20,
    color: '#92d9f5',
  },

  tinyText: {
    fontSize: 25,
    color: '#92d9f5',
  },

  icon: {
    fontSize: 120,
    marginBottom: 24,
  },
});
