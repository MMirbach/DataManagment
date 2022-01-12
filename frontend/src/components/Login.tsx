import React from "react";
import CredForm from "./CredForm";
import { AlertProps } from "./FeedbackAlert";

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<AlertProps>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return <CredForm onSubmit={onLogin}></CredForm>;
};

export default Login;
