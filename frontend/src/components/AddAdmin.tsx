import React from "react";
import axios, { AxiosResponse } from "axios";
import CredForm from "./CredForm";

interface AddAdminProps {}

const AddAdmin: React.FC<AddAdminProps> = () => {
    const handleSubmit = async (
        username: string,
        password: string
    ): Promise<string> => {
        try {
            const res = await axios.post("http://localhost:5000/admins", {
                admin_name: username,
                password: password,
            });
            return res.data;
        } catch (error: AxiosResponse<any, any> | any) {
            return error.response.data;
        }
    };

    return <CredForm onSubmit={handleSubmit}></CredForm>;
};

export default AddAdmin;
