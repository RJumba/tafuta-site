import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../lib/supabase";

export default function HousingMap() {
  const [housingLocations, setHousingLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultCenter = [0.5143, 35.2698]; // Eldoret town

  useEffect(() => {
    fetchHousingLocations();
  }, []);

  async function fetchHousingLocations() {
    setLoading(true);

    const { data, error } = await supabase
      .from("housing_listings")
      .select(`
        id,
        title,
        description,
        price,
        location_name,
        latitude,
        longitude,
        is_available,
        housing_options (
          id,
          name
        )
      `)
      .eq("is_available", true)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching housing map data:", error.message);
      setHousingLocations([]);
    } else {
      setHousingLocations(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <p className="text-slate-600">Loading housing map...</p>
      </div>
    );
  }

  if (housingLocations.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-slate-800">Housing Map</h2>
        <p className="mt-2 text-slate-600">
          No housing locations found. Add records in the housing_listings table
          with latitude and longitude.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">
          Housing Locations Map
        </h2>
        <p className="mt-2 text-slate-600">
          View available Tafuta housing options by location.
        </p>
      </div>

      <div className="h-[430px] overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {housingLocations.map((house) => (
            <Marker
              key={house.id}
              position={[Number(house.latitude), Number(house.longitude)]}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="font-semibold">{house.title}</h3>

                  <p>{house.location_name}</p>

                  {house.housing_options?.name && (
                    <p>Type: {house.housing_options.name}</p>
                  )}

                  {house.price && (
                    <p>KES {Number(house.price).toLocaleString()} / month</p>
                  )}

                  {house.description && (
                    <p className="max-w-[220px]">{house.description}</p>
                  )}

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${house.latitude},${house.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block pt-2 text-blue-600 underline"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}