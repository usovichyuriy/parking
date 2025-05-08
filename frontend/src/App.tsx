import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthForm from "./components/AuthForm/AuthForm";
import ParkingSlotList from "./components/ParkingSpotList/ParkingSpotList";
import BookingCalendar from "./components/BookingCalendar/BookingCalendar";
import ReservationHistory from "./components/ReservationHistory/ReservationHistory";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ParkingSlotList />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/book/:id" element={<BookingCalendar />} />
        <Route path="/reservations" element={<ReservationHistory />} />
      </Routes>
    </div>
  );
}

export default App;
