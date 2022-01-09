import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import ShowAdmins from "./ShowAdmins";
import AddAdmin from "./AddAdmin";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export enum OperationTypes {
    None = 0,
    ShowAdmins = 1,
    AddAdmin = 2,
    CreatePoll = 3,
}

interface OperationsProps {
    type: OperationTypes;
    onClose: () => void;
}

const Operations: React.FC<OperationsProps> = ({ type, onClose }) => {
    return (
        <Dialog
            fullScreen
            open={type !== OperationTypes.None}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: "static" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {(type === OperationTypes.ShowAdmins && "Admins") ||
                            (type === OperationTypes.AddAdmin && "Add Admin") ||
                            (type === OperationTypes.CreatePoll &&
                                "Create Poll")}
                    </Typography>
                </Toolbar>
            </AppBar>
            {type === OperationTypes.ShowAdmins && <ShowAdmins></ShowAdmins>}
            {type === OperationTypes.AddAdmin && <AddAdmin></AddAdmin>}
        </Dialog>
    );
};

export default Operations;
