import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Reservation from "./Reservation/Reservation";
import classes from "./ReservationHistory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useRef } from "react";
import {
  getUserReservations,
  IReservation,
} from "../../redux/reservationSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { clearReservationError } from "../../redux/reservationSlice";

const ReservationHistory: React.FC = () => {
  const reservations = useSelector(
    (state: RootState) => state.reservation.reservationHistory
  );
  const userId = useSelector((state: RootState) => state.auth.userId);
  const error = useSelector((state: RootState) => state.reservation.error);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const previousReservationsRef = useRef<IReservation[]>([]);

  useEffect(() => {
    const previousReservations = previousReservationsRef.current;

    reservations.forEach((reservation) => {
      const previous = previousReservations.find(
        (previousReservation) => previousReservation.id === reservation.id
      );

      if (previous && previous.status !== reservation.status) {
        toast.success("Reservation was cancelled!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    });

    previousReservationsRef.current = reservations;

    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      dispatch(clearReservationError());
    }

    if (userId) {
      dispatch(getUserReservations(userId));
    } else {
      navigate("/auth");
    }
  }, [dispatch, userId, navigate, error, reservations]);

  return (
    <div>
      <h2>Reservation history</h2>
      <ToastContainer />
      <div className={classes.reservationsTable}>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Reservation ID</TableCell>
              <TableCell>Parking spot number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cancel Reservation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {reservations.map((reservation) => (
              <Reservation
                id={reservation.id}
                spotId={reservation.parking_spot_number}
                reservedDate={reservation.reserved_date}
                reservedTime={reservation.reserved_time}
                status={reservation.status}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ReservationHistory;
