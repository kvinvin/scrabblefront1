import React from 'react'
import '../css/letter.css'

export class Letter extends React.Component {
    render() {
        if (this.props.letter === null) {
            return (
                <button
                    className= "emptyLetterSlot"
                    onClick = {this.props.handleEmptyLetterSlotClick}
                />
            )
        }
        let color = "";
        let className = "";

        if (this.props.type === "board") {
            className = "playedLetter";
            color = "#00004F";
        }
        else {
            className = "playerLetter";
        }
        if (this.props.selected === false) {color ="#00004F"} else {color = "#9D322F";}
        return (
            <button className= {className}
                    onClick = {this.props.select}
                    style = {{backgroundColor: color}}
            >
                <div className="letter">{this.props.letter}</div>
                <div className="points">{this.props.points}</div>
            </button>
        )
    }
}