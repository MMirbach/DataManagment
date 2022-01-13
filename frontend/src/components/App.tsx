import axios from "axios";
import React, { useState } from "react";
import "../styles/App.css";
import Login from "./Login";
import Main from "./Main";
import { Buffer } from "buffer";
import { AlertTypes } from "./FeedbackAlert";

const encodeString = (base: string): string => {
    return Buffer.from(base).toString("base64");
};

function App() {
    const handleLogOut = (): void => {
        localStorage.removeItem("user");
    };

    const handleLogin = async (username: string, password: string) => {
        try {
            const encoded = encodeString(`${username}:${password}`);
            await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/admins/login`,
                { user: encoded }
            );
            setTimeout(() => localStorage.setItem("user", encoded), 500);
            return { type: AlertTypes.Success, msg: "Logged In" };
        } catch (error: any) {
            return { type: AlertTypes.Error, msg: error.response.data };
        }
    };

    return (
        <div className="App">
            {localStorage.getItem("user") === undefined ? (
                <Login onLogin={handleLogin}></Login>
            ) : (
                <Main onLogOut={handleLogOut}></Main>
            )}
        </div>
    );
}

export default App;
