import { Button, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classes from "./ParkingSpot.module.css";

interface IParkingSpotProps {
  id: number;
  location: string;
}

const ParkingSpot: React.FC<IParkingSpotProps> = (props) => {
  const navigate = useNavigate();

  const handleChooseTime = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <TableRow>
      <TableCell className={classes.cell}>{props.id}</TableCell>
      <TableCell className={classes.cell}>{props.location}</TableCell>
      <TableCell className={classes.cell}>
        <Button variant="contained" onClick={() => handleChooseTime(props.id)}>
          Choose time
        </Button>
      </TableCell>
    </TableRow>
  );
};
export default ParkingSpot;
