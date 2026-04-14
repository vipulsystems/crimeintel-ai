import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "../../styles/profileMap.css";

// FIX leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Neon marker
const neonIcon = new L.DivIcon({
  className: "neon-marker",
  html: '<div class="pulse-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function ProfileGeoMap({ locations = [] }) {
  // Filter valid coordinates
  const validLocations = useMemo(
    () =>
      locations.filter(
        (l) =>
          typeof l.lat === "number" &&
          typeof l.lng === "number"
      ),
    [locations]
  );

  const center = validLocations.length
    ? [validLocations[0].lat, validLocations[0].lng]
    : [20.5937, 78.9629];

  const polyline = validLocations.map((l) => [l.lat, l.lng]);

  return (
    <div className="profile-map-card">
      <h3 className="profile-map-title">
        🌍 Access Map — Login History
      </h3>
      <p className="profile-map-sub">
        Showing login locations based on geo-IP logs.
      </p>

      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        className="profile-map"
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />

        {validLocations.length > 1 && (
          <Polyline
            positions={polyline}
            color="#00eaff"
            weight={2}
          />
        )}

        {validLocations.map((loc, i) => (
          <Marker
            key={i}
            position={[loc.lat, loc.lng]}
            icon={neonIcon}
          >
            <Popup>
              <strong>
                {loc.city || "Unknown"}, {loc.country || ""}
              </strong>
              <br />
              Device: {loc.device || "N/A"}
              <br />
              IP: {loc.ip || "N/A"}
              <br />
              Time:{" "}
              {loc.time
                ? new Date(loc.time).toLocaleString()
                : "N/A"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}