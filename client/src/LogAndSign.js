import React, { useState } from "react";
import axios from "axios";
import Home from "./Home";
import { TextField, Button, InputAdornment } from '@material-ui/core';
import { AccountCircle, LockRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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
                window.alert("User Already Exists");
            }
            else {
                setData(res.data);
                window.alert("Register Done");
            }
        }).catch((error) => {
            window.alert("OPS REGISTER FAILED WITH ERROR: ", error);
        })
    };

    function login() {
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
                }
                else {
                    setLoggedIn(false);
                    window.alert(res.data);
                }
            }).catch(error => window.alert("OPS LOGIN FAILED WITH ERROR: ", error));
    };

    return (
        <div className="App">
            {!isLoggedIn ?
                <div className={classes.paper}>
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
