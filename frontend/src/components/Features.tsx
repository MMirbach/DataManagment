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
    AddAdmin = 2,
    CreatePoll = 3,
}

interface FeaturesProps {
    type: FeatureTypes;
    onClose: () => void;
}

const Features: React.FC<FeaturesProps> = ({ type, onClose }) => {
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
                            (type === FeatureTypes.AddAdmin && "Add Admin") ||
                            (type === FeatureTypes.CreatePoll && "Create Poll")}
                    </Typography>
                </Toolbar>
            </AppBar>
            {type === FeatureTypes.ShowAdmins && <ShowAdmins></ShowAdmins>}
            {type === FeatureTypes.AddAdmin && <AddAdmin></AddAdmin>}
            {type === FeatureTypes.CreatePoll && <CreatePoll></CreatePoll>}
        </Dialog>
    );
};

export default Features;
