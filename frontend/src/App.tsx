import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import logo from "./usc-scope-logo.png";
import "./App.css";

function App() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    34.022,
    -118.285,
  ]); // USC default

  const [results, setResults] = useState<any[]>([]); // <-- store fake API results

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickup(value);

    // Example: typing "USC" moves marker to USC
    if (value.toLowerCase() === "usc") {
      setMarkerPosition([34.022, -118.285]);
    }
  };

  // 🔥 API CALL: This is the important part
  const handleCompare = async () => {
    if (!pickup || !dropoff) {
      alert("Please enter pickup and dropoff locations.");
      return;
    }

    // You can add a real time input later, but hardcoding is fine for now
    const time = "14:00";

    const url = `http://127.0.0.1:5000/api/ride/estimate?start=${pickup}&end=${dropoff}&time=${time}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setResults([]);
        return;
      }

      setResults(data.results); // Save the JSON results
    } catch (err) {
      console.error(err);
      alert("Failed to fetch price data from the API.");
    }
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* USC Logo */}
      <img
        src={logo}
        alt="USC Scope Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />
      <h1>Ride Price Comparison</h1>

      {/* Flex container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={handlePickupChange}
              style={{
                padding: "8px",
                marginRight: "10px",
                width: "calc(100% - 20px)",
              }}
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

          <button
            onClick={handleCompare}
            style={{
              padding: "10px 20px",
              marginBottom: "20px",
              cursor: "pointer",
              background: "#990000",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Compare Prices
          </button>

          {/* Ride result cards (DYNAMIC) */}
          <div
            className="result-cards"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {results.length === 0 && (
              <p style={{ color: "#666" }}>Enter locations and compare prices.</p>
            )}

            {results.map((ride, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(90deg, #444, #777)",
                  padding: "15px",
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                <h3>🚗 {ride.service}</h3>
                <p><strong>Price:</strong> ${ride.price}</p>
                <p><strong>Distance:</strong> {ride.distance_miles} miles</p>
                <p><strong>Duration:</strong> {ride.estimated_duration_min} mins</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: MAP */}
        <div style={{ flex: 1 }}>
          <MapContainer
            center={markerPosition}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={markerPosition}>
              <Popup>Pickup Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
