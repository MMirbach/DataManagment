import { List, ListItem, ListItemText, Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ShowAdminsProps {
    on401: () => void;
}

const ShowAdmins: React.FC<ShowAdminsProps> = ({ on401 }) => {
    const [adminNames, setAdminNames] = useState<Array<string>>([]);

    const getAdminNames = async (): Promise<Array<string>> => {
        try {
            const res = await axios.get(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/admins`,
                {
                    headers: {
                        Authorization: `Basic ${localStorage.getItem("user")}`,
                    },
                }
            );
            return res.data;
        } catch (error: any) {
            if (error.response.status === 401) on401();
            return [];
        }
    };

    useEffect(() => {
        getAdminNames().then(res => setAdminNames(res));

        return () => setAdminNames([]);
    }, []);

    return (
        <List>
            {adminNames.map((name: string, index: number) => (
                <React.Fragment key={index}>
                    <ListItem>
                        <ListItemText primary={name} />
                    </ListItem>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

export default ShowAdmins;
