import React from 'react'

const TileDescription= (props) => {
    return (
        <div className="tileInformation">
            <div className="square" style={{backgroundColor: props.color}}/>
            <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                {props.value}
            </div>
        </div>
    )
};

export const Legend = () => {
    return (
        <div className="legendRectangle">
            <div className="textStyle" style={{top: "8px", height: "55px"}}>Legend</div>
            <TileDescription color = "#FACC7A" value= {"Double Letter"}/>
            <TileDescription color = "#526AA7" value= {"Triple Letter"}/>
            <TileDescription color = "#AF805E" value= {"Double Word"}/>
            <TileDescription color = "#9D322F" value= {"Triple Word"}/>
        </div>
    )
};