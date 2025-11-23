export async function geocodeLocation(location: string): Promise<[number, number] | null> {
    if(!location) return null;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.length === 0) {
            return null; // No results found
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lat, lon];
    } catch (err) {
        console.error("Geocoding error:", err);
        return null;
    }
}