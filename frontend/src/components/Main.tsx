import React from "react";
import { useState } from "react";
import Operations from "./Operations";
import { OperationTypes } from "./Operations";
import Navbar from "./Navbar";

interface MainProps {
    onLogOut: () => void;
}

const Main: React.FC<MainProps> = ({ onLogOut }) => {
    const [operation, setOperation] = useState<OperationTypes>(
        OperationTypes.None
    );

    const handleShowAdmin = (): void => {
        setOperation(OperationTypes.ShowAdmins);
    };

    const handleAddingAdmin = (): void => {
        setOperation(OperationTypes.AddAdmin);
    };

    const handleCreatingPoll = (): void => {
        setOperation(OperationTypes.CreatePoll);
    };

    const handleClose = (): void => {
        setOperation(OperationTypes.None);
    };

    return (
        <React.Fragment>
            <Navbar
                onShowAdmins={handleShowAdmin}
                onAddAdmin={handleAddingAdmin}
                onCreatePoll={handleCreatingPoll}
                onLogOut={onLogOut}
            ></Navbar>
            <Operations type={operation} onClose={handleClose}></Operations>
        </React.Fragment>
    );
};

export default Main;
