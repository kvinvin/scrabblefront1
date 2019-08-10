import React from 'react'
import '../css/letter.css'

//Renders a letter. Is a functional stateless presentational component
export const Letter = (props) =>{
    if (props.letter === null) {
        return (<button
            className= "emptyLetterSlot"
            onClick = {props.handleEmptyLetterSlotClick}
        />)
    }
    let color = "";
    let className = "";

    if (props.type === "board") {
        className = "playedLetter";
        color = "#00004F";
    }
    else {
        className = "playerLetter";
    }
    if (props.selected === false) {color ="#00004F"} else {color = "#9D322F";}
    return (
        <button className= {className}
                onClick = {props.select}
                style = {{backgroundColor: color}}
        >
            <div className="letter">{props.letter}</div>
            <div className="points">{props.points}</div>
        </button>
    )
};

// As a comparison, the above functional component is shown below in the form of a class component
/*export class Letter extends React.Component {
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
}*/