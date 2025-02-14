import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLatLng, getNearbyParkings } from "../services/mapService";

const ParkingSpots = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";
    const [parkingLocations, setParkingLocations] = useState([]);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (searchQuery) {
            fetchParkingSpots();
        }
    }, [searchQuery]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        window.initMap = () => {
            const newMap = new window.google.maps.Map(
                document.getElementById("googleMap"),
                {
                    center: { lat: 40.7128, lng: -74.006 },
                    zoom: 12,
                }
            );
            setMap(newMap);
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const fetchParkingSpots = async () => {
        try {
            const { lat, lng } = await getLatLng(searchQuery);
            const parkings = await getNearbyParkings(lat, lng);

            setParkingLocations(parkings);

            if (map) {
                map.setCenter({ lat, lng });
                map.setZoom(14);

                parkings.forEach((location) => {
                    new window.google.maps.Marker({
                        position: location.geometry.location,
                        map: map,
                        title: location.name,
                    });
                });
            }
        } catch (error) {
            console.error("Error fetching parking locations:", error);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center">Available Parking Spots</h2>

            <div id="googleMap" className="w-100" style={{ height: "500px", borderRadius: "5px" }}></div>

            {parkingLocations.length > 0 && (
                <div className="mt-4">
                    {parkingLocations.map((location, index) => {
                        const imageUrl = location.photos
                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${location.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
                            : "https://via.placeholder.com/400"; // Default image

                        return (
                            <div key={index} className="card my-2 p-3">
                                <img
                                    src={imageUrl}
                                    alt={location.name}
                                    className="w-100 rounded"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <h3>{location.name}</h3>
                                <p>
                                    <strong>Address:</strong> {location.vicinity}
                                </p>

                                {location.opening_hours && (
                                    <p>
                                        <strong>Open Now:</strong> {location.opening_hours.open_now ? "Yes" : "No"}
                                    </p>
                                )}

                                {location.rating && (
                                    <p>
                                        <strong>Rating:</strong> {location.rating} ⭐
                                    </p>
                                )}

                                {location.reviews && location.reviews.length > 0 && (
                                    <div className="reviews mt-2">
                                        <h4>Reviews:</h4>
                                        {location.reviews.slice(0, 3).map((review, i) => (
                                            <div key={i} className="review p-2 border rounded mt-1">
                                                <p>
                                                    <strong>{review.author_name}:</strong> {review.text}
                                                </p>
                                                <p>
                                                    <strong>Rating:</strong> {review.rating} ⭐
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParkingSpots;
