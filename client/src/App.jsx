import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Movies from "./pages/Movies";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourite from "./pages/favourite";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer";

const App = () => {
  const isAdmin = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />
      {/* this hides the navbar on admin mode */}

      {!isAdmin && <Navbar />}

      {/* setting up the routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favourite" element={<Favourite />} />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
};

export default App;
