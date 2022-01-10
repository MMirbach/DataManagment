import React from "react";
import axios, { AxiosResponse } from "axios";
import CredForm from "./CredForm";
import { AlertProps } from "./FeedbackAlert";

interface AddAdminProps {}

const AddAdmin: React.FC<AddAdminProps> = () => {
    const handleSubmit = async (
        username: string,
        password: string
    ): Promise<AlertProps> => {
        try {
            await axios.post("http://localhost:5000/admins", {
                admin_name: username,
                password: password,
            });
            return { ok: true, msg: "Admin Added" };
        } catch (error: AxiosResponse<any, any> | any) {
            return { ok: false, msg: error.response.data };
        }
    };

    return <CredForm onSubmit={handleSubmit}></CredForm>;
};

export default AddAdmin;
