import React from "react";
import "../styles/App.css";
import Main from "./Main";

function App() {
    const handleLogOut = (): void => {};

    return (
        <div className="App">
            <Main onLogOut={handleLogOut}></Main>
        </div>
    );
}

export default App;
