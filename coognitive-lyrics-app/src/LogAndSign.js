import React, { useState } from "react";
//import { BrowserRouter, Link, Route, Switch, useHistory } from "react-router-dom";
import axios from "axios";
import Home from "./Home";


function LogAndSign() {

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
            setData(res.data);
        });
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
                }
            });
    };

    return (
        <div className="App">
            {!isLoggedIn ?
                <div>
                    <div>
                        <h1>Register</h1>
                        <input
                            placeholder="username"
                            onChange={(e) => setRegisterUsername(e.target.value)}
                        />
                        <input
                            placeholder="password"
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        <button onClick={register}>Submit</button>
                    </div>

                    <div>
                        <h1>Login</h1>
                        <input
                            placeholder="username"
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                        <input
                            placeholder="password"
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button onClick={login}>Submit</button>
                    </div>
                </div>
                : <Home user={data} />}
        </div>
    )
}

export default LogAndSign
