import React from 'react'
import './playerElement.css'
import {Letter} from "./letter.js";


export class PlayerLetters extends React.Component {
    handleSelected = (i, letter) => {
        const newLetter = {
            type: "player",
            location: i,
            letter: letter.letter,
            points: letter.points
        };
        if(this.props.selectedLetter !== newLetter) {
            this.props.changeSelectedLetter(newLetter);
        }
    };

    render() {
        //Creates the list of letters that the player has
        const playerLetters = [];
        for(let i=0; i<7; i++){
            let isSelected = false;
            if (this.props.selectedLetter.type === "player" && this.props.selectedLetter.location === i) {
                isSelected = true;
            }
            playerLetters.push(
                <Letter
                    key = {i}
                    letter={this.props.letters[i].letter}
                    points={this.props.letters[i].points}
                    select = {() => this.handleSelected(i, this.props.letters[i])}
                    selected = {isSelected}
                    handleEmptyLetterSlotClick = {() => this.props.handleEmptyLetterSlotClick(i)}
                />);
        }
        return(
            <div className="playerLetters-grid">
                {playerLetters}
            </div>
        )
    }
}

export class PlayerInfo extends React.Component {
    render() {
        return (
            <div className="rectangle">
                <div className="innerRectangle">
                    <div className="textStyle" style={{top: "5px"}}>{this.props.username}</div>
                    <div className="textStyle" style={{top: "8px"}}>{this.props.score}</div>
                </div>
            </div>
        )
    }
}