import { useDispatch, useSelector } from "react-redux";
import ParkingSpot from "./ParkingSpot/ParkingSpot";
import classes from "./ParkingSpotList.module.css";
import { AppDispatch, RootState } from "../../redux/store";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getParkingSpots } from "../../redux/parkingSpotSlice";

const ParkingSlotList: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const parkingSpots = useSelector(
    (state: RootState) => state.parkingSpot.parkingSpots
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGetReservations = () => {
    navigate(`/reservations`);
  };

  useEffect(() => {
    if (userId) {
      dispatch(getParkingSpots());
    } else {
      navigate("/auth");
    }
  }, [dispatch, userId, navigate]);

  return (
    <div>
      <div className={classes.listHeader}>
        <h2>Parking spots</h2>
        <Button
          variant="contained"
          className={classes.historyButton}
          onClick={handleGetReservations}
        >
          My Reservations
        </Button>
      </div>
      <div className={classes.parkingSpotTable}>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Parking spot</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Reservation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {parkingSpots.map((parkingSpot, index) => (
              <ParkingSpot
                key={index}
                id={parkingSpot.id}
                location={parkingSpot.location}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ParkingSlotList;
