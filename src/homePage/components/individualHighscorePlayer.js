import React from "react";

export const IndividualHighscorePlayer = (props) => {
    return (
        <div className="tileInformation">
            <div className="square" style={{backgroundColor: props.color}}>
                <div className= "textStyle" style={{top: "8px"}}>
                    {props.player.highScore}
                </div>
            </div>
            <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                {props.player.username}
            </div>
        </div>
    )
};