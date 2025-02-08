import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLatLng, getNearbyParkings } from "../services/mapService";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [parkingLocations, setParkingLocations] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }&callback=initMap`;
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

  const handleSearch = async () => {
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

  // Default Placeholder Image
  const defaultImage =
    "data:image/jpeg;base64,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";

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Smart Parking
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#map">
                  Find Parking
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header
        className="hero text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          width: "100%",
          minHeight: "100vh",
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://www.mokosmart.com/wp-content/uploads/2022/03/smart-parking.webp') center/cover",
          color: "white",
        }}
      >
        <h1>Find & Book Parking Instantly</h1>
        <p className="lead">
          Easy & Fast Parking Spot Reservation with Real-time Availability
        </p>
        <div className="d-flex flex-column align-items-center w-50">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter place to search parking"
            className="form-control my-2"
            style={{ width: "100%", maxWidth: "500px", padding: "12px" }}
          />
          <button
            onClick={handleSearch}
            className="btn btn-primary"
            style={{ width: "100%", maxWidth: "200px" }}
          >
            Search
          </button>

          {parkingLocations.length > 0 && (
            <div className="mt-4">
              {parkingLocations.map((location, index) => {
                // Get image URL if available
                const imageUrl = location.photos
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${location.photos[0].photo_reference}&key=YOUR_GOOGLE_API_KEY`
                  : defaultImage;

                return (
                  <div key={index} className="card my-2 p-3">
                    {/* Display Cover Image */}
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

                    {/* Display Opening Hours */}
                    {location.opening_hours && (
                      <p>
                        <strong>Open Now:</strong>{" "}
                        {location.opening_hours.open_now ? "Yes" : "No"}
                      </p>
                    )}

                    {/* Display Ratings */}
                    {location.rating && (
                      <p>
                        <strong>Rating:</strong> {location.rating} ⭐
                      </p>
                    )}

                    {/* Display Reviews */}
                    {location.reviews && location.reviews.length > 0 && (
                      <div className="reviews mt-2">
                        <h4>Reviews:</h4>
                        {location.reviews.slice(0, 3).map((review, i) => (
                          <div
                            key={i}
                            className="review p-2 border rounded mt-1"
                          >
                            <p>
                              <strong>{review.author_name}:</strong>{" "}
                              {review.text}
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
      </header>

      <section id="map" className="container my-5">
        <h2 className="text-center">Find Parking on Map</h2>
        <div
          id="googleMap"
          className="w-100"
          style={{ height: "500px", borderRadius: "5px" }}
        ></div>
      </section>

      <footer className="bg-dark text-white text-center py-4">
        <p>Smart Parking System &copy; 2025 | Designed By Tanmay Kanase ❤️</p>
      </footer>
    </>
  );
};

export default Home;
