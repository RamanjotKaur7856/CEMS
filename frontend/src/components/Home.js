import React from "react";
import { Link } from "react-router-dom";


function Home() {
  return (
    <section id="home" className="home-section">
      <div className="overlay">
        <div className="home-content">
          <h1>Welcome to Our Website</h1>
          <p>Discover the latest updates and activities</p>
        </div>
        <Link to="/events" className="explore-btn">Explore Events</Link>
      </div>
    </section>
  );
}

export default Home;
