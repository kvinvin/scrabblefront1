import React from 'react'
import './decoration.css'

export class Title extends React.Component {
    render() {
        return (
            <div className="title-box">
                <div className="title">GAMENAME</div>
                <hr className="title-line"/>
            </div>
        )
    }
}

export class Legend extends React.Component {
    render() {
        return (
            <div className="legendRectangle">
                <div className="textStyle" style={{top: "8px"}}>Legend</div>
            </div>
        )
    }
}