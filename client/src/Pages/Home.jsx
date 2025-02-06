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
              {parkingLocations.map((location, index) => (
                <div key={index} className="card my-2 p-3">
                  <h3>{location.name}</h3>
                  <p>{location.vicinity}</p>
                </div>
              ))}
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
