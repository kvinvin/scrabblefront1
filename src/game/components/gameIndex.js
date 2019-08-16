//libraries
import React from 'react';
import axios from 'axios/index';

//CSS
import '../css/gameIndex.css';

//Components
import {GiveUp, SaveAndExit, Submit} from './gameButtons.js'
import {Title} from '../../generic/title.js';
import {Board} from './gameBoard.js';
import {PlayerInfo, PlayerLetters} from './playerElements';
import {Legend} from "./legend";

//Helper Functions
import {validateAllRequirements} from "../controller/handleValidation";
import {calculateScore} from "../controller/helper/scoreCalculator";


const emptyLetter = {
    letter: null,
    points: null
};

/*Game contains as state all the game-wide data to be saved*/
export class Game extends React.Component {
    state = {
        //letters player can play in current round
        playerLetters: [
            emptyLetter,
            emptyLetter,
            emptyLetter,
            emptyLetter,
            emptyLetter,
            emptyLetter,
            emptyLetter
        ],
        reserveLetters: [],
        placedLetters: [
            /*letters placed on the game board.
                *   letter: letter value
                *   points: points value for that letter
                *   roundPlaced: the round it was placed in
                *   location: location on board where it is to be placed
                *   multiplier: multiplier effect of tile letter is placed on
                */
        ],
        //letter that is currently selected
        selectedLetter: {
            type: null, //either of type "player" or "board"
            location: null, //index in list where the letter is to be found
            letter: null, //the letter that was selected
            points: null, // the points of the selected letter
            roundPlaced: null //the round the selected letter was placed in
        },
        words: [],
        round: 1,
        //a list of possible locations where a letter can be placed is saved as state to avoid recalculating again
        possibleLocations: [112],
        score: 0,
    };

    /////////////////////////////// GAME SETUP ///////////////////////////////////////
    loadGame = async () => {
        const response = await axios.post('/getSavedGame', {username: this.props.username, gameName: this.props.gameName});
        this.setState(response.data)
    };

    componentDidMount() {
        if(this.props.loadGame) {
            this.loadGame();
        } else {
            fetch('/createGame')
                .then(res => res.json())
                .then(initialState => {
                    this.setState( initialState)})
        }


    }

    /////////////////////////////// ADMINISTRATIVE FUNCTIONS /////////////////////////
    //handles save and exit button click
    handleSaveAndExit = () => {
        this.props.handleSaveAndExit(this.state);
    };

    //handles end of game for giveUp button press or completed game
    handleEndGame = () => {
        this.props.handleEndGame(this.state.score)
    };

    //////////////////////////////// LETTER FUNCTIONALITY ////////////////////////////
    //updates selectedLetter to the new selected letter
    changeSelectedLetter = (newLetter) => {
        this.setState({selectedLetter: newLetter});
    };

    //adds a playerLetter to the board by adding it to the list of placedLetters
    async addLetterToPlacedLetters (newLetter) {
        let tmp = this.state.placedLetters.slice();
        //then add the newLetter to this array
        tmp.push(newLetter);
        await this.setState({placedLetters: tmp});
    }

    /*
    * 1- Finds letter in placedLetters list with position of selectedLetter
    * 2- Removes the old item from the list
    *
    * The letter that is being moved
    * selectedLetter {
    *   type: "player" or "board". Board in this case
    *   location: index in list where the letter is to be found (either in playerLetters or placedLetters
    *   letter,
    *   points
    * }
    * */
    removeSelectedLetterFromBoardLocation () {
        const location = this.state.selectedLetter.location;
        let tmp = this.state.placedLetters.slice();
        //need to find the letter in placedLetters that has the right location
        const index = tmp.findIndex(letter => letter.location === location);
        tmp.splice(index, 1);
        this.setState({placedLetters: tmp});
    }

    //gets called from Board in handleTileClick(). Deletes moved letter from old position
    removeSelectedLetterFromPlayerDock () {
        const location = this.state.selectedLetter.location;
        let tmp = this.state.playerLetters.slice();
        tmp[location] = {
            "letter": null,
            "points": null
        };
        this.setState({playerLetters: tmp})
    }

    removeSelectedLetterFromPreviousLocation () {
        if (this.state.selectedLetter.type === "board") {
            this.removeSelectedLetterFromBoardLocation();
        }
        else {
            this.removeSelectedLetterFromPlayerDock()
        }
    }

    /*
     * Responsible for handling a click event on a tile.
     * If a letter was selected, function adds letter with new location to placedLetters and
     * removes letter from its previous location.
     *
     * Parameters:
     *  - i: location on board where letter is to be placed
     *  - multiplier: the multiplier effect of the clicked letter
    */
    handleBoardTileClick = async (i, multiplier) => {
        const selectedLetter = this.state.selectedLetter;
        //make sure a letter is already "selected", otherwise don't continue
        if(selectedLetter.letter === null){
            return;
        }
        //generate letter object to be placed
        const newLetter = {
            letter: selectedLetter.letter,
            points: selectedLetter.points,
            roundPlaced: this.state.round,
            location: i,
            multiplier: multiplier
        };
        await this.addLetterToPlacedLetters(newLetter);
        //remove the letter from the previous location
        this.removeSelectedLetterFromPreviousLocation();
        //set selectedLetter to null
        const emptyLetter = {
            type: null,
            location: null,
            letter: null,
            points: null,
            roundPlaced: null
        };
        this.changeSelectedLetter(emptyLetter);
    };

    //adds a letter from the board to the player dock, if all conditions are met
    async addLetterToPlayerLetters (i, newLetter) {
        let tmp = this.state.playerLetters.slice();
        //then add the newLetter to this array
        tmp[i] = newLetter;
        await this.setState({playerLetters: tmp});
    }

    //responsible for checking if conditions are met to move letter from board to player dock
    handleEmptyLetterSlotClick = async (i) => {
        const selectedLetter = this.state.selectedLetter;
        const round = this.state.round;

        //make sure a letter is already "selected", otherwise don't continue
        if(selectedLetter.letter === null || selectedLetter.roundPlaced !== round) return;

        //generate letter object to be placed
        const newLetter = {
            letter: selectedLetter.letter,
            points: selectedLetter.points
        };
        const emptyLetter = {
            type: null,
            letter: null,
            points: null
        };

        await this.addLetterToPlayerLetters(i, newLetter);
        this.removeSelectedLetterFromPreviousLocation();
        //set selectedLetter to null
        this.changeSelectedLetter(emptyLetter);
    };

    ////////////////////////////////// REFILL LETTERS FROM RESERVE ///////////////////////
    async refillPlayerLetters(){
        let reserveLetters = this.state.reserveLetters;
        const oldPlayerLetters = this.state.playerLetters;
        let allLettersUsed = 0;
        const newPlayerLetters = oldPlayerLetters.map(letter => {
            if(letter.letter === null && reserveLetters.length > 0) {
                return (reserveLetters.splice(0,1))[0];
            }
            return letter
        });

        this.setState({
            reserveLetters: reserveLetters,
            playerLetters: newPlayerLetters
        });

        await newPlayerLetters.map(async (letter) => {
            if(letter.letter === null && reserveLetters.length === 0) {
                allLettersUsed++;
            }
        });

        if (allLettersUsed === 7) {
            this.props.handleModalAlert({
                modalHeader: "Congratulations, you're done!",
                modalAlertMessage: "You got a score of " + this.state.score,
                modalButtonValue: 'OK'
            });
            alert("Congratulations! You finished the game with a score of " + this.state.score);
            this.handleEndGame();
        }
    }

    ////////////////////////////////// HANDLING OF END OF ROUND //////////////////////////
    //makes sure that the letters placed fit all the right requirements before moving on to the next round
    handleSubmitClick = async () => {
        //save initial values of state
        const round = this.state.round;
        const possibleLocations = this.state.possibleLocations;
        const score = this.state.score;
        const placedLetters = this.state.placedLetters;
        const words = this.state.words;

        //create local variables needed for updating state variables
        const newLetters = placedLetters.filter(letter => letter.roundPlaced === round);
        const newRound = round + 1;
        let scoreInfo;

        try{
            //values is a json with {possibleLocationsUpdate, newWords, validWords}
            const values = await validateAllRequirements(newLetters, placedLetters, round, possibleLocations);
            if (!values.validWords) {
                throw String ("One of the words you placed is not a valid word");
            }
            scoreInfo = await calculateScore(values.newWords, score);

            this.props.handleModalAlert({
                modalHeader: 'New points added from word(s) played:',
                modalAlertMessage: 'Score: ' + scoreInfo.oldScore
                    + " + "
                    + scoreInfo.wordsScore.join(" + ")
                    + " = "
                    + scoreInfo.newScore,
                modalButtonValue: "Next round"
            });
            words.push(values.newWords);
            this.setState({
                score: scoreInfo.newScore,
                words: words,
                possibleLocations: values.possibleLocations,
                round: newRound
            });
            await this.refillPlayerLetters();
        } catch (e) {
            this.props.handleModalAlert({
                modalHeader: 'Hey, you got something wrong here!',
                modalAlertMessage: e,
                modalButtonValue: 'OK'
            });
        }
    };

    render() {
        return(
            <div className="game">
                <SaveAndExit handleSaveAndExit = {this.handleSaveAndExit}/>
                <Title gameName = {this.props.gameName}/>
                <GiveUp handleEndGame = {this.handleEndGame}/>
                <PlayerInfo
                    score = {this.state.score}
                    username= {this.props.username}
                />
                <Board
                    selectedLetter = {this.state.selectedLetter}
                    placedLetters = {this.state.placedLetters}
                    changeSelectedLetter = {this.changeSelectedLetter}
                    round = {this.state.round}
                    handleBoardTileClick = {this.handleBoardTileClick}
                />
                <Legend/>
                <div className="round">
                    Round: {this.state.round}
                </div>
                <PlayerLetters
                    selectedLetter = {this.state.selectedLetter}
                    changeSelectedLetter = {this.changeSelectedLetter}
                    letters = {this.state.playerLetters}
                    handleEmptyLetterSlotClick = {this.handleEmptyLetterSlotClick}
                />
                <Submit handleSubmitClick = {this.handleSubmitClick} />
            </div>
        )
    }
}