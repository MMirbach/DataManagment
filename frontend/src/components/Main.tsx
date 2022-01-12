import React, { useState } from "react";
import Charts from "./Charts";
import Features, { FeatureTypes } from "./Features";
import Navbar from "./Navbar";

interface MainProps {
    onLogOut: () => void;
}

const Main: React.FC<MainProps> = ({ onLogOut }) => {
    const [feature, setFeature] = useState<FeatureTypes>(FeatureTypes.None);

    const handleShowAdmin = (): void => {
        setFeature(FeatureTypes.ShowAdmins);
    };

    const handleAddingAdmin = (): void => {
        setFeature(FeatureTypes.AddAdmin);
    };

    const handleCreatingPoll = (): void => {
        setFeature(FeatureTypes.CreatePoll);
    };

    const handleClose = (): void => {
        setFeature(FeatureTypes.None);
    };

    return (
        <React.Fragment>
            <Navbar
                onShowAdmins={handleShowAdmin}
                onAddAdmin={handleAddingAdmin}
                onCreatePoll={handleCreatingPoll}
                onLogOut={onLogOut}
            ></Navbar>
            <Features
                type={feature}
                onClose={handleClose}
                on401={onLogOut}
            ></Features>
            <Charts on401={onLogOut}></Charts>
        </React.Fragment>
    );
};

export default Main;
