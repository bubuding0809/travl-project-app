import React from "react";
import {
  Circle,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { HospitalProximity } from "../server/router/hospital";

type GoogleMapWindowProps = {
  center: {
    lat: number;
    lng: number;
  };
  hospitals: HospitalProximity[] | undefined;
  radius: number;
};
const containerStyle = {
  width: "100%",
  height: "60vh",
};

const GoogleMapWindow: React.FC<GoogleMapWindowProps> = ({
  center,
  hospitals,
  radius,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB469uMOR4R5xNE9-Yq-9_JbqKo-bKda0A",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback((map: any) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map: any) => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: "cooperative",
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <Marker
        position={{
          lat: center.lat,
          lng: center.lng,
        }}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 5,
        }}
      />
      <Circle
        center={center}
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#F7F7F7",
          fillOpacity: 0.35,
          clickable: false,
          draggable: false,
          editable: false,
          visible: true,
          radius: radius * 1000,
          zIndex: 1,
        }}
      />
      {hospitals?.map(hospital => (
        <Marker
          key={hospital.hid}
          position={{
            lat: hospital.latitude!,
            lng: hospital.longitude!,
          }}
          clickable={true}
          animation={4}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(GoogleMapWindow);
