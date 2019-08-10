import React from "react";

//The function needs to be placed as a separate function because an onClick function cannot have the () in JSX
export const FoundGameButton = (props) => {
    const getFullGame = () => {
        props.getFullGame(props.gameName);
    };

    if (props.hidden) {
        return null;
    }
    else {
        return (
            <button className = "foundGame" onClick={getFullGame}>
                {props.gameName}
            </button>
        )
    }
};