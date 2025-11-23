import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import logo from "./usc-scope-logo.png"; // Make sure this image is in src/
import "./App.css";

function App() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([34.022, -118.285]); // USC default

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup(e.target.value);

    // Example: typing "USC" moves marker to USC
    if (e.target.value.toLowerCase() === "usc") {
      setMarkerPosition([34.022, -118.285]);
    }
  };

  const handleCompare = () => {
    console.log("Pickup:", pickup);
    console.log("Dropoff:", dropoff);
    // You can add real API calls later
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* USC Logo */}
      <img src={logo} alt="USC Scope Logo" style={{ width: "120px", marginBottom: "20px" }} />
      <h1>Ride Price Comparison</h1>

      {/* Flex container for left and right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        
        {/* Left side: inputs + ride cards */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={handlePickupChange}
              style={{ padding: "8px", marginRight: "10px", width: "calc(100% - 20px)" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Dropoff Location"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              style={{ padding: "8px", width: "calc(100% - 20px)" }}
            />
          </div>
          <button onClick={handleCompare} style={{ padding: "10px 20px", marginBottom: "20px", cursor: "pointer" }}>
            Compare Prices
          </button>

          {/* Ride result cards */}
          <div className="result-cards" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="card" style={{ background: "linear-gradient(90deg, red, orange)", padding: "15px", borderRadius: "8px", color: "white" }}>
              <h3>🚗 Uber</h3>
              <p>$12.50</p>
            </div>
            <div className="card" style={{ background: "linear-gradient(90deg, yellow, green)", padding: "15px", borderRadius: "8px", color: "white" }}>
              <h3>🚗 Lyft</h3>
              <p>$11.80</p>
            </div>
            <div className="card" style={{ background: "linear-gradient(90deg, blue, purple)", padding: "15px", borderRadius: "8px", color: "white" }}>
              <h3>🚗 Waymo</h3>
              <p>$13.00</p>
            </div>
          </div>
        </div>

        {/* Right side: Map */}
        <div style={{ flex: 1 }}>
          <MapContainer center={markerPosition} zoom={13} style={{ height: "500px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={markerPosition}>
              <Popup>Current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
