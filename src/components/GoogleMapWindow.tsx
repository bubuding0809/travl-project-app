import React, { useEffect, useRef } from "react";
import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { HospitalProximity } from "../server/router/hospital";
import { env } from "../env/client.mjs";

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
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [selected, setSelected] = React.useState<HospitalProximity | null>(
    null
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map) {
      map.setZoom(Math.round(radius / -30) + 12);
    }
  }, [radius]);
  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
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
      {selected && isOpen && (
        <InfoWindow
          onCloseClick={() => {
            setIsOpen(false);
          }}
          position={{
            lat: selected.latitude!,
            lng: selected.longitude!,
          }}
        >
          <div className="flex flex-col gap-2 p-1">
            <div>
              <h2 className="text-lg font-bold">{selected.hospitalName}</h2>
              <p className=" font-normal">{selected.address}</p>
              <p className="mt-1">
                <a className="link link-hover" href={`tel:${selected.phoneNo}`}>
                  {selected.phoneNo}
                </a>
              </p>
              <p className="mt-1 text-xs">
                {selected.distance} km away from center
              </p>
            </div>
            <a
              className="link link-primary"
              target={"_blank"}
              rel="noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${selected.hospitalName}`}
            >
              View on Google Map
            </a>
          </div>
        </InfoWindow>
      )}
      {hospitals?.map(hospital => (
        <Marker
          key={hospital.hid}
          position={{
            lat: hospital.latitude!,
            lng: hospital.longitude!,
          }}
          clickable={true}
          animation={4}
          onClick={() => {
            setSelected(hospital);
            setIsOpen(false);
            setTimeout(() => setIsOpen(true), 1);
          }}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(GoogleMapWindow);
