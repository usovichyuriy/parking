import { useEffect, useState } from "react";
import classes from "./AuthForm.module.css";
import { Button, ButtonGroup, OutlinedInput } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { useDispatch, useSelector } from "react-redux";
import { authUser, clearAuthError } from "../../redux/authSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const error = useSelector((state: RootState) => state.auth.error);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(authUser({ email, password, mode }));
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }

    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      dispatch(clearAuthError());
    }
  }, [isAuth, navigate, error, dispatch]);

  return (
    <div className={classes.authForm}>
      <h2>Parking spots</h2>
      <ToastContainer />
      <div className={classes.chooseModeButtons}>
        <ButtonGroup variant="outlined" fullWidth sx={{ display: "flex" }}>
          <Button
            onClick={() => setMode("login")}
            sx={{
              borderColor: "#33c965",
              backgroundColor: mode === "login" ? "#33c965" : "",
              color: mode === "login" ? "#fff" : "#33c965",
              textTransform: "none",
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => setMode("register")}
            sx={{
              borderColor: "#33c965",
              backgroundColor: mode === "register" ? "#33c965" : "",
              color: mode === "register" ? "#fff" : "#33c965",
              textTransform: "none",
            }}
          >
            Register
          </Button>
        </ButtonGroup>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={classes.formInput}>
          <label>
            <EmailIcon className={classes.inputIcon} />
          </label>
          <OutlinedInput
            type="email"
            value={email}
            placeholder="Email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={classes.formInput}>
          <label>
            <KeyIcon className={classes.inputIcon} />
          </label>
          <OutlinedInput
            type="password"
            value={password}
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className={classes.submitButton}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AuthForm;
