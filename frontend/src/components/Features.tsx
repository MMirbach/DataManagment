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
import CreatePoll from "./CreatePoll";
import ShowPollsStatus from "./ShowPollsStatus";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export enum FeatureTypes {
    None = 0,
    ShowAdmins = 1,
    ShowPollStatus = 2,
    AddAdmin = 3,
    CreatePoll = 4,
}

interface FeaturesProps {
    type: FeatureTypes;
    onClose: () => void;
    on401: () => void;
}

const Features: React.FC<FeaturesProps> = ({ type, onClose, on401 }) => {
    return (
        <Dialog
            fullScreen
            open={type !== FeatureTypes.None}
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
                        {(type === FeatureTypes.ShowAdmins && "Admins") ||
                            (type === FeatureTypes.ShowPollStatus &&
                                "Polls Status") ||
                            (type === FeatureTypes.AddAdmin && "Add Admin") ||
                            (type === FeatureTypes.CreatePoll && "Create Poll")}
                    </Typography>
                </Toolbar>
            </AppBar>
            {type === FeatureTypes.ShowAdmins && (
                <ShowAdmins on401={on401}></ShowAdmins>
            )}
            {type === FeatureTypes.ShowPollStatus && (
                <ShowPollsStatus on401={on401}></ShowPollsStatus>
            )}
            {type === FeatureTypes.AddAdmin && (
                <AddAdmin on401={on401}></AddAdmin>
            )}
            {type === FeatureTypes.CreatePoll && (
                <CreatePoll on401={on401}></CreatePoll>
            )}
        </Dialog>
    );
};

export default Features;
