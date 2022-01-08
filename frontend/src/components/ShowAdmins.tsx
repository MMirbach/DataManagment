import { List, ListItem, ListItemText, Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ShowAdminsProps {}

const ShowAdmins: React.FC<ShowAdminsProps> = () => {
    const [adminNames, setAdminNames] = useState<Array<string>>([]);

    const getAdminNames = async (): Promise<Array<string>> => {
        const res = await axios.get("http://localhost:5000/admins");
        return res.data;
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
