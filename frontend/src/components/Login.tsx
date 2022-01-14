import { Typography } from "@mui/material";
import React from "react";
import CredForm from "./CredForm";
import { AlertProps } from "./FeedbackAlert";

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<AlertProps>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <React.Fragment>
            <Typography variant="h1" color="primary" sx={{ mt: 5 }}>
                The Pollinator
            </Typography>
            <CredForm onSubmit={onLogin}></CredForm>
        </React.Fragment>
    );
};

export default Login;
