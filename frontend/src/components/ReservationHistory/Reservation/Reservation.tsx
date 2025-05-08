import { Button, TableCell, TableRow } from "@mui/material";
import classes from "./Reservation.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { cancelReservation } from "../../../redux/reservationSlice";

interface IReservationProps {
  id: number;
  spotId: number;
  reservedDate: string;
  reservedTime: string;
  status: string;
}

const Reservation: React.FC<IReservationProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCancelReservation = (id: number) => {
    dispatch(cancelReservation(id));
  };

  return (
    <TableRow>
      <TableCell className={classes.cell}>{props.id}</TableCell>
      <TableCell className={classes.cell}>{props.spotId}</TableCell>
      <TableCell className={classes.cell}>{props.reservedDate}</TableCell>
      <TableCell className={classes.cell}>{props.reservedTime}</TableCell>
      <TableCell className={classes.cell}>{props.status}</TableCell>
      <TableCell className={classes.cell}>
        <Button
          variant="contained"
          onClick={() => handleCancelReservation(props.id)}
        >
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  );
};
export default Reservation;
