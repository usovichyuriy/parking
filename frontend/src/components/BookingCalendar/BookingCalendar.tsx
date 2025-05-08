import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import classes from "./BookingCalendar.module.css";
import TimeGrid from "./TimeGrid/TimeGrid";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  changeToastShow,
  getAvailableTimeForSpot,
  setCurrentSpotId,
} from "../../redux/reservationSlice";
import { toast, ToastContainer } from "react-toastify";

const BookingCalendar: React.FC = () => {
  const id = useParams<{ id: string }>().id;

  const parking_spot_id = useSelector(
    (state: RootState) => state.reservation.parking_spot_id
  );
  const reservationHistory = useSelector(
    (state: RootState) => state.reservation.reservationHistory
  );
  const toastShow = useSelector(
    (state: RootState) => state.reservation.toastShow
  );

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const availableTime = useSelector(
    (state: RootState) => state.reservation.availableTime
  );

  useEffect(() => {
    if (reservationHistory.length > 0 && !toastShow) {
      toast.success("Reservation was made!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      dispatch(changeToastShow());
    }

    if (id) {
      dispatch(setCurrentSpotId(Number(id)));
    }
  }, [id, dispatch, reservationHistory, toastShow]);

  const handleDateChange = (chosenDate: Dayjs | null) => {
    setSelectedDate(chosenDate);
    const date = chosenDate?.format("YYYY-MM-DD");

    if (parking_spot_id && date) {
      dispatch(getAvailableTimeForSpot({ parking_spot_id, date }));
    }
  };

  return (
    <div className={classes.bookingCalendarWrapper}>
      <h2>Reservation of parking slot № {parking_spot_id}</h2>
      <ToastContainer />
      <div className={classes.bookingCalendar}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Choose day"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className={classes.availableTimeTable}>
        <TimeGrid
          spotId={Number(id)}
          reservedDate={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
          availableTime={availableTime}
        />
      </div>
    </div>
  );
};
export default BookingCalendar;
