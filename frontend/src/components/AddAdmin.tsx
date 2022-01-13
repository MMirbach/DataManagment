import React from "react";
import axios from "axios";
import CredForm from "./CredForm";
import { AlertProps, AlertTypes } from "./FeedbackAlert";

interface AddAdminProps {
    on401: () => void;
}

const AddAdmin: React.FC<AddAdminProps> = ({ on401 }) => {
    const handleSubmit = async (
        username: string,
        password: string
    ): Promise<AlertProps> => {
        try {
            await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/admins`,
                {
                    admin_name: username,
                    password: password,
                },
                {
                    headers: {
                        Authorization: `Basic ${localStorage.getItem("user")}`,
                    },
                }
            );
            return { type: AlertTypes.Success, msg: "Admin Added" };
        } catch (error: any) {
            if (error.response.status === 401) on401();
            return { type: AlertTypes.Error, msg: error.response.data };
        }
    };

    return <CredForm onSubmit={handleSubmit}></CredForm>;
};

export default AddAdmin;
