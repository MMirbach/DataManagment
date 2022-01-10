import { Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface AlertProps {
    ok: boolean;
    msg: string;
}

interface FeedbackAlertProps {
    alert: AlertProps;
    onClose: () => void;
}

const FeedbackAlert: React.FC<FeedbackAlertProps> = ({ alert, onClose }) => {
    return (
        <Collapse in={alert.msg !== ""}>
            <Alert
                severity={alert.ok ? "success" : "error"}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                {alert.msg}
            </Alert>
        </Collapse>
    );
};

export default FeedbackAlert;
