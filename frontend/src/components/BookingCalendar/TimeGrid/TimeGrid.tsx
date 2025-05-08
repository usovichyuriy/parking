import { Button, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { createReservation } from "../../../redux/reservationSlice";

interface ITimeGridProps {
  spotId: number;
  reservedDate: string;
  availableTime: string[];
}

const TimeGrid: React.FC<ITimeGridProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOnClick = (reservedTime: string) => {
    dispatch(
      createReservation({
        spotId: props.spotId,
        reservedDate: props.reservedDate,
        reservedTime,
      })
    );
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      {props.availableTime.map((time) => (
        <Button
          variant="contained"
          onClick={() => {
            handleOnClick(time);
          }}
        >
          {time}
        </Button>
      ))}
    </Grid>
  );
};

export default TimeGrid;
