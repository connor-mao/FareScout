import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeLocation } from "../geocode";
import { useEffect, useState } from "react";
import type { MapOptions } from "leaflet";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png?url';
import markerIcon from 'leaflet/dist/images/marker-icon.png?url';
import markerShadow from 'leaflet/dist/images/marker-shadow.png?url';


// Fix Leaflet's default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapContainerProps {
    pickup: string;
    dropoff: string;
}


export default function MapComponent({ pickup, dropoff }: MapContainerProps) {
  const [startCoords, setStartCoords] = useState<[number, number]>([34.022, -118.285]); // Default to USC
  const [endCoords, setEndCoords] = useState<[number, number]>([34.022, -118.2437]); // Default to LA
  const [bounds, setBounds] = useState<[number, number][]>([startCoords, endCoords]);

  useEffect(() => {
    async function updateCoords() {
      const start = await geocodeLocation(pickup);
      const end = await geocodeLocation(dropoff);
      
      if(start) setStartCoords(start);
      if(end) setEndCoords(end);
      
      if(start && end) {
        setBounds([start, end]);
      }
    }

  if (pickup || dropoff) updateCoords();
}, [pickup, dropoff]);

const mapOptions: MapOptions = {
  scrollWheelZoom: false,
};

  return (
    <MapContainer
      bounds = {bounds}
      style = {{ height: "500px", width: "100%", marginTop: "20px" }}
      {...mapOptions}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        {...{attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }}
      />
      <Marker position = {startCoords}>
        <Popup>Pickup Location</Popup>  
      </Marker>
      <Marker position = {endCoords}>
        <Popup>Dropoff Location</Popup>  
      </Marker>
    </MapContainer>
  );
}