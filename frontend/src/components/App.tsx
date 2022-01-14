import axios from "axios";
import React, { useRef, useState } from "react";
import "../styles/App.css";
import Login from "./Login";
import Main from "./Main";
import { Buffer } from "buffer";
import { AlertTypes } from "./FeedbackAlert";

const encodeString = (base: string): string => {
    return Buffer.from(base).toString("base64");
};

function App() {
    const [user, setUser] = useState<string>("");
    const handleLogOut = (): void => {
        sessionStorage.removeItem("user");
        setUser("");
    };

    const handleLogin = async (username: string, password: string) => {
        try {
            const encoded = encodeString(`${username}:${password}`);
            await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/admins/login`,
                { user: encoded }
            );
            setTimeout(() => {
                sessionStorage.setItem("user", encoded);
                setUser(encoded);
            }, 500);
            return { type: AlertTypes.Success, msg: "Logged In" };
        } catch (error: any) {
            return { type: AlertTypes.Error, msg: error.response.data };
        }
    };

    return (
        <div className="App">
            {sessionStorage.getItem("user") === null ? (
                <Login onLogin={handleLogin}></Login>
            ) : (
                <Main onLogOut={handleLogOut}></Main>
            )}
        </div>
    );
}

export default App;
