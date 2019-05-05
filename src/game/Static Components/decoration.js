import React from 'react'
import './decoration.css'

export class Title extends React.Component {
    render() {
        return (
            <div className="title-box">
                <div className="title">PARIS</div>
                <hr className="title-line"/>
            </div>
        )
    }
}

export class Legend extends React.Component {
    render() {
        return (
            <div className="legendRectangle">
                <div className="textStyle" style={{top: "8px", height: "55px"}}>Legend</div>
                <div className="tileInformation">
                    <div className="square" style={{backgroundColor: "#FACC7A"}}/>
                    <div className="textStyle" style={{top: "6px", textAlign: "left"}}>Double Letter</div>
                </div>
                <div className="tileInformation">
                    <div className="square" style={{backgroundColor: "#526AA7"}}/>
                    <div className="textStyle" style={{top: "6px", textAlign: "left"}}>Triple Letter</div>
                </div>
                <div className="tileInformation">
                    <div className="square" style={{backgroundColor: "#AF805E"}}/>
                    <div className="textStyle" style={{top: "6px", textAlign: "left"}}>Double Word</div>
                </div>
                <div className="tileInformation">
                    <div className="square" style={{backgroundColor: "#9D322F"}}/>
                    <div className="textStyle" style={{top: "6px", textAlign: "left"}}>Triple Word</div>
                </div>
            </div>
        )
    }
}