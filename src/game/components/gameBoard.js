import React from 'react'
import '../css/gameBoard.css'
import {Letter} from './letter';
import {Tile} from './tile'

export class Board extends React.Component {

    //finds multiplier of tile to be placed on board
    static findMultiplier(i) {
        let multiplier = "none";
        const x = i % 105; //used for placing some repeated pattern with modulo. x follows a modulo pattern, i is the array index
        if ([0, 14].includes(x) || [7, 217].includes(i)) {
            multiplier = "w3";
        } else if ([20, 24].includes(i % 60) || [76, 88, 136, 148].includes(i)) {
            multiplier = "l3";
        } else if ([3, 11].includes(x) || [36, 38, 45, 52, 59, 92, 96, 98, 102, 122, 126, 128, 132, 165, 172, 179, 186, 188].includes(i)) {
            multiplier = "l2";
        } else if (i % 16 === 0 || i % 14 === 0) {
            multiplier = "w2";
        }
        return multiplier;
    }

    //creates a selectedLetter object, and if it is different than the previous selection, it updates it
    handleLetterClick(i, letter) {
        if (this.props.round > letter.roundPlaced) {
            return;
        }
        const newLetter = {
            type: "board",
            location: i,
            letter: letter.letter,
            points: letter.points,
            roundPlaced: letter.roundPlaced
        };
        if(this.props.selectedLetter !== newLetter) {
            this.props.changeSelectedLetter(newLetter);
        }
    }

    placeLetter(i, j, isSelected) {
        return (
            <Letter
                key = {i}
                letter={this.props.placedLetters[j].letter}
                points={this.props.placedLetters[j].points}
                type = "board"
                select = {() => this.handleLetterClick(i, this.props.placedLetters[j])}
                selected = {isSelected}
            />
        )
    }

    placeTile(i) {
        //returns the multiplier of the current index location
        let multiplier = Board.findMultiplier(i);
        return (
            <Tile
                key = {i}
                multiplier={multiplier}
                selectedLetter={this.props.selectedLetter}
                handleTileClick={() => this.props.handleBoardTileClick(i, multiplier)}
            />
        )
    }

    placeLetterOrTile(i) {
        const selectedLetter = this.props.selectedLetter;
        const placedLetters = this.props.placedLetters;
        //loop through the placed letters saved and check if any is placed on location i
        for (let j = 0; j < placedLetters.length; j++) {
            //if true it saves a letter in the location i
            if (placedLetters[j].location === i) {
                //isSelected becomes true when the letter to be placed is the current selected letter in the game
                let isSelected = false;
                if (selectedLetter.type === "board" && selectedLetter.location === i) {
                    isSelected = true;
                }
                return this.placeLetter(i, j, isSelected);
            }
        }
        //if no fitting letter can be found, the corresponding tile is placed
        return this.placeTile(i);
    }

    generateTileArray() {
        const tiles = [];
        for (let i = 0; i < 225; i++) {
            //tile saves the component
            let tile = this.placeLetterOrTile(i);
            tiles.push(tile);
        }
        return tiles;
    }

    render() {
        //Create a list of tiles of length 225, later gets sorted into a grid of 15x15
        const tiles = this.generateTileArray();
        return (
            <div className="board">
                {tiles}
            </div>
        )
    }
}