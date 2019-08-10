import React from 'react'
import '../css/gameButtons.css'

export class SaveAndExit extends React.Component {
    render() {
        return (
            <button className="button" onClick = {this.props.handleSaveAndExit}>
                <div className="arrow">
                    <div className="arrowHead"/>
                    <div className="arrowLine"/>
                </div>
                <div className="textStyle">Save & Exit</div>
            </button>
        )
    }
}

export class GiveUp extends React.Component {
    render() {
        return (
            <button className="button" onClick = {this.props.handleEndGame}>
                <div className="xShape">X</div>
                <div className="textStyle">Give Up</div>
            </button>
        )
    }
}

export class Submit extends React.Component {
    render() {
        return (
            <button className="submitButton" onClick = {this.props.handleSubmitClick}>
                <div className="arrow" style={{transform: "rotate(180deg)", top: "-2px", left: "-9px"}}>
                    <div className="arrowHead" style={{top: "23px"}}/>
                    <div className="arrowLine" style={{top: "12px"}}/>
                </div>
            </button>
        )
    }
}