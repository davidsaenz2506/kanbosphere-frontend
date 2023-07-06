import React, { useState } from "react";

import Thunderstorm from "../../../../../public/assets/weather/tormenta.png";
import Drizzle from "../../../../../public/assets/weather/llovizna.png";
import Rain from "../../../../../public/assets/weather/lluvia-muy-fuerte.png";
import Snow from "../../../../../public/assets/weather/nevando.png";
import Clear from "../../../../../public/assets/weather/sol.png";
import Clouds from "../../../../../public/assets/weather/nublado.png";
import Default from "../../../../../public/assets/weather/clima.png";

import { GeolocatedResult, useGeolocated } from "react-geolocated";

import Image from "next/image";

import styles from "../main.module.css";

const WeatherComponent = () => {
  const geolocated: GeolocatedResult = useGeolocated();
  const geoLocationProps: GeolocationCoordinates | undefined =
    geolocated.coords;

  const userApiKey = "742d815c91a00ff4e3e4184efa96d48f";

  const [currentPngWeather, setCurrentPngWeather] = useState<any>();

  const [currentUserWeather, setCurrentUserWeather] = useState<any>();

  const [temperatureUnits, setTemperatureUnits] = useState("metric");

  const defaultLatitude: number = 51.5072;
  const defaultLongitude: number = 0.1276;

  async function getCurrentUserWeather(userAPI: string) {
    const response: Response = await fetch(userAPI);

    const userData: any = await response.json();

    return userData;
  }

  React.useEffect(() => {
    const weatherAPI: string = `https://api.openweathermap.org/data/2.5/weather?lat=${
      geoLocationProps?.latitude ? geoLocationProps.latitude : defaultLatitude
    }&lon=${
      geoLocationProps?.longitude
        ? geoLocationProps.longitude
        : defaultLongitude
    }&appid=${userApiKey}&units=${temperatureUnits}`;
    getCurrentUserWeather(weatherAPI)
      .then((result) => setCurrentUserWeather(result))
      .catch((error) => console.error(error));
  }, [geoLocationProps]);

  React.useEffect(() => {
    switch (currentUserWeather?.weather[0]?.main) {
      case "Thunderstorm":
        setCurrentPngWeather(Thunderstorm);
        break;

      case "Drizzle":
        setCurrentPngWeather(Drizzle);
        break;

      case "Rain":
        setCurrentPngWeather(Rain);
        break;

      case "Snow":
        setCurrentPngWeather(Snow);
        break;

      case "Clear":
        setCurrentPngWeather(Clear);
        break;

      case "Clouds":
        setCurrentPngWeather(Clouds);
        break;

      default:
        setCurrentPngWeather(Default);
        break;
    }
  }, [currentUserWeather]);

  return (
    <div className={styles.weatherSection}>
      <div className={styles.weatherCard}>
        <div className={styles.currentLocation}>
          <h3 style={{ fontWeight: "bold" }}>Tumble weather</h3>
          <p style={{ fontSize: "50px" }}>{currentUserWeather?.main?.temp}° </p>
          <p>{currentUserWeather?.name}</p>
          <p>Humedad {currentUserWeather?.main?.humidity}% </p>
          <p>Temperatura maxima {currentUserWeather?.main?.temp_max}° C </p>
        </div>
        <div className={styles.weatherImage}>
          <Image
            className={styles.userImage}
            height={150}
            width={150}
            src={currentPngWeather}
            alt={"newImage"}
          />
          <p
            style={{
              fontSize: "40px",
              marginTop: "10px",
            }}
          >
            {currentUserWeather?.weather[0]?.main}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
