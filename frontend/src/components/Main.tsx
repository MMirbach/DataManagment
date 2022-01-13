import React, { useState } from "react";
import Charts from "./Charts";
import Features, { FeatureTypes } from "./Features";
import Navbar from "./Navbar";

interface MainProps {
    onLogOut: () => void;
}

const Main: React.FC<MainProps> = ({ onLogOut }) => {
    const [feature, setFeature] = useState<FeatureTypes>(FeatureTypes.None);

    const handleChangeFeature = (feature: FeatureTypes): void => {
        setFeature(feature);
    };

    return (
        <React.Fragment>
            <Navbar onChange={handleChangeFeature} onLogOut={onLogOut}></Navbar>
            <Features
                type={feature}
                onClose={() => handleChangeFeature(FeatureTypes.None)}
                on401={onLogOut}
            ></Features>
            <Charts on401={onLogOut}></Charts>
        </React.Fragment>
    );
};

export default Main;
