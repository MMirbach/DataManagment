import React from "react";
import axios from "axios";
import { DBResponse } from "./CredForm";

interface AddAdminProps {}

const AddAdmin: React.FC<AddAdminProps> = () => {
    const handleSubmit = async (
        username: string,
        password: string
    ): Promise<DBResponse> => {
        const res = await axios.post("http://localhost:5000/admins", {
            username: username,
            password: password,
        });
        return { success: res.status === 200, msg: res.data };
    };

    return <div></div>;
};

export default AddAdmin;
