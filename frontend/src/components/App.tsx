import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import "../styles/App.css";
import { AlertProps } from "./FeedbackAlert";
import Login from "./Login";
import Main from "./Main";
import { Buffer } from "buffer";

const encodeString = (base: string): string => {
    return Buffer.from(base).toString("base64");
};

const decodeString = (encoded: string): string => {
    return Buffer.from(encoded, "base64").toString("ascii");
};

function App() {
    const [user, setUser] = useState<string>("");

    const handleLogOut = (): void => {
        setUser("");
    };

    const handleLogin = async (username: string, password: string) => {
        try {
            const encoded = encodeString(`${username}:${password}`);
            await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/admins/login`,
                { user: encoded }
            );
            setTimeout(() => setUser(username), 500);
            localStorage.setItem("user", encoded);
            return { ok: true, msg: "Logged In" };
        } catch (error: AxiosResponse<any, any> | any) {
            return { ok: false, msg: error.response.data };
        }
    };

    return (
        <div className="App">
            {user === "" ? (
                <Login onLogin={handleLogin}></Login>
            ) : (
                <Main onLogOut={handleLogOut}></Main>
            )}
        </div>
    );
}

export default App;
