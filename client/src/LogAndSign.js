import React, { useState } from "react";
import axios from "axios";
import Home from "./Home";
import { TextField, Button, InputAdornment } from '@material-ui/core';
import { AccountCircle, LockRounded } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));

function LogAndSign() {

    const classes = useStyles();

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [data, setData] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [status, setStatusBase] = useState('');
    const [open, setOpen] = useState(false);

    const register = () => { //when it is called it sends the logic to backend
        axios({
            method: "POST",
            data: {
                username: registerUsername,
                password: registerPassword,
            },
            withCredentials: true,
            url: "http://localhost:4000/register",
        }).then((res) => {
            if (res.data === 'User Already Exists') {
                setStatusBase(res.data);
                setOpen(true);
            }
            else {
                setData(res.data);
                setStatusBase("Register Done");
                setOpen(true);
            }
        }).catch((error) => {
            setStatusBase(error);
            setOpen(true);
        })
    };

    const login = () => {
        axios({
            method: "POST",
            data: {
                username: loginUsername,
                password: loginPassword,
            },
            withCredentials: true,
            url: "http://localhost:4000/login",
        })
            .then((res) => {
                setData(res.data);
                if (res.data._id) {
                    setLoggedIn(true);
                    //no need to update status for alert because rendering Home page
                }
                else {
                    setLoggedIn(false);
                    setStatusBase("User Not Found");
                    setOpen(true);
                }
            }).catch(error => {
                setStatusBase(error)
                setOpen(true);
            });
    };

    return (
        <div className="App">
            {!isLoggedIn ?
                <div className={classes.paper}>
                    <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                        <Alert color="info" variant="filled">{status}</Alert>
                    </Snackbar>
                    <div>
                        <h1>Register</h1>
                        <TextField
                            label="Username"
                            color="primary"
                            variant="outlined"
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }}
                        />
                        <TextField
                            type="password"
                            label="Password"
                            color="primary"
                            variant="outlined"
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><LockRounded /></InputAdornment> }}

                        />
                        <div>
                            <Button onClick={register} variant="contained" color="primary" >Register</Button>
                        </div>
                    </div>
                    <div>
                        <h1>Login</h1>

                        <TextField
                            label="Username"
                            color="primary"
                            variant="outlined"
                            onChange={(e) => setLoginUsername(e.target.value)}
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }}
                        />
                        <TextField
                            type="password"
                            label="Password"
                            color="primary"
                            variant="outlined"
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            InputProps={{ startAdornment: <InputAdornment position="start"><LockRounded /></InputAdornment> }}

                        />
                        <div>
                            <Button onClick={login} variant="contained" color="primary" >Login</Button>
                        </div>
                    </div>
                </div>
                : <Home user={data} />}
        </div>
    )
}

export default LogAndSign
