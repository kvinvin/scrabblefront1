import React from 'react'
import './gameIndex.css'
import {GiveUp, SaveAndExit, Submit} from './Static Components/gameButtons.js'
import {Legend, Title} from "./Static Components/decoration.js";
import {Board} from "./gameBoard.js";
import {PlayerInfo, PlayerLetters} from "./playerElements";
import Letters from "./letterData";
//import {analyzeWord} from './analyzeWord';
import {validateAllRequirementsExceptWordValidation, collectWords, analyzeWords, calculateScore, updateRound} from "./handleSubmitClick";


/*Game contains as state all the game-wide data to be saved*/
export class Game extends React.Component {
    constructor (props) {
        super (props);

        //this.generateArrayFromObjects = this.generateArrayFromObjects.bind(this);
        //this.shuffle = this.shuffle.bind(this);

        /*let reserveLetters = this.generateArrayFromObjects(Letters);
        console.log("RL:" + reserveLetters);
        let shuffledReserveLetters = this.shuffle(reserveLetters);
        console.log("SRL: " + shuffledReserveLetters);
        let firstSeven = shuffledReserveLetters.splice(0,7);*/
        this.state = {
            //letters player can play in current round
            playerLetters: [
                Letters.z,
                Letters.y,
                Letters.x,
                Letters.w,
                Letters.v,
                Letters.u,
                Letters.t],
            reserveLetters: [
                Letters.a,
                Letters.b,
                Letters.c,
                Letters.d,
                Letters.e,
                Letters.f,
                Letters.g,
                Letters.h,
                Letters.i,
                Letters.j,
                Letters.k,
                Letters.l,
                Letters.m,
                Letters.n,
                Letters.o,
                Letters.p,
                Letters.q,
                Letters.r,
                Letters.s,
                Letters.t,
                Letters.u,
                Letters.v,
                Letters.w,
                Letters.x,
                Letters.y,
                Letters.z,
            ],
            /*letters placed on the game board.
            *   letter: letter value
            *   points: points value for that letter
            *   roundPlaced: the round it was placed in
            *   location: location on board where it is to be placed
            *   multiplier: multiplier effect of tile letter is placed on
            * */
            placedLetters: [],
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
            //a list of possible locations where a letter can be placed. Is saved as state to avoid recalculating again
            possibleLocations: [112],
            score: 0
        };
        //only bind the functions that get passed on as props
        this.changeSelectedLetter = this.changeSelectedLetter.bind(this);
        this.handleBoardTileClick = this.handleBoardTileClick.bind(this);
        this.handleEmptyLetterSlotClick = this.handleEmptyLetterSlotClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }
    /*
        generateArrayFromObjects (objectList) {
            const letters = [];
            Object.keys(objectList).forEach(key => {
                const frequency = objectList[key].frequency;
                let letter = {
                    letter: objectList[key].letter,
                    points: objectList[key].points
                }
                for(let i = 0; i < frequency; i++){
                    letters.push(letter)
                }
            });
            return letters;
        };

        async shuffle (set) {
            const arraySize = set.length;
            for (let i = arraySize; i > 0; i-- ) {
                const r = Math.floor(Math.random() * arraySize);
                let temp = set[arraySize - 1];
                set[arraySize - 1] = set[r]; //places random var at end of array
                set[r] = temp;
            }
            return set
        };
    */
    //updates selectedLetter to the new selected letter
    changeSelectedLetter (newLetter) {
        this.setState({selectedLetter: newLetter});
    }


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
    async handleBoardTileClick(i, multiplier) {
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
    }


    //adds a letter from the board to the player dock, if all conditions are met
    async addLetterToPlayerLetters (i, newLetter) {
        let tmp = this.state.playerLetters.slice();
        //then add the newLetter to this array
        tmp[i] = newLetter;
        await this.setState({playerLetters: tmp});
    }

    //responsible for checking if conditions are met to move letter from board to player dock
    async handleEmptyLetterSlotClick(i) {
        const selectedLetter = this.state.selectedLetter;
        const round = this.state.round;
        //make sure a letter is already "selected", otherwise don't continue
        if(selectedLetter.letter === null || selectedLetter.roundPlaced !== round){
            return;
        }
        //generate letter object to be placed
        const newLetter = {
            letter: selectedLetter.letter,
            points: selectedLetter.points
        };
        await this.addLetterToPlayerLetters(i, newLetter);
        this.removeSelectedLetterFromPreviousLocation();
        //set selectedLetter to null
        const emptyLetter = {
            type: null,
            letter: null,
            points: null
        };
        this.changeSelectedLetter(emptyLetter);
    }

    refillPlayerLetters(){
        let reserveLetters = this.state.reserveLetters;
        const oldPlayerLetters = this.state.playerLetters;
        console.log("leftOvers: " + oldPlayerLetters);
        const newPlayerLetters = oldPlayerLetters.map(letter => {
            if(letter.letter === null && reserveLetters.length > 0) {
                return (reserveLetters.splice(0,1))[0];
            }
            return letter
        });
        this.setState({
            reserveLetters: reserveLetters,
            playerLetters: newPlayerLetters
        })
    }


    //TODO: seperate submitClick function so that it calls on another validation function, and if it returns ok then
    // complete necessary steps. This is currently not a pure function
    //makes sure that the letters placed fit all the right requirements before moving on to the next round
    async handleSubmitClick () {
        //save initial values of state
        const round = this.state.round;
        const placedLetters = this.state.placedLetters;
        const score = this.state.score;
        const newLetters = placedLetters.filter(letter => letter.roundPlaced === round);
        const possibleLocations = this.state.possibleLocations;


        let words = this.state.words;
        let validatedAllWords = false;
        validateAllRequirementsExceptWordValidation(newLetters, round, possibleLocations)
            .then( async (values) => {
                console.log("got into validation process");
                //Array that collects all created words
                //words = await collectWords(newLetters, placedLetters); //PAY ATTENTION HERE IS MISTAKE
                await collectWords(newLetters, placedLetters)
                    .then( async (newWords) => {
                        console.log ("Big word length: " + newWords.length);
                        validatedAllWords = analyzeWords(newWords);
                        const newScore = await calculateScore(newWords, score);
                        console.log("NeWWWWW: " + newScore);
                        this.setState({score: newScore});
                        words.push(newWords);
                        this.setState({words: words});
                    });

                this.setState({possibleLocations: values[4]});

                const newRound = updateRound(round);
                this.setState({round: newRound});

                this.refillPlayerLetters();
            })
            .catch((e) => {throw alert(e)});

    }

    render() {
        return(
            <div className="game">
                <SaveAndExit handleSaveAndExit = {this.props.handleSaveAndExit}/>
                <Title gameName = {this.props.gameName}/>
                <GiveUp/>
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


/*
* TODO:
*   1. LOGIC
    *       a. add constrictions on finish button
    *           - words formed need to be proper words
    *               1. extract words DONE
    *               2. analyze words
    *       b.  generate a list of shuffled letters from letterData and save it in state.
    *       c. detect (after submit is pressed) when no more letters are present in player letters and reserve letters and show
    *           - the score
    *           - its placement in the high score list
    *           - BUTTON: return to home
    *           - BUTTON: play again
*   2. DESIGN
    *       a. when a round is successfully ended, add a 5-10 second page showing how the score gets calculated
    *           - darker background
    *           - each tile in large (word and score)
    *           - multiplier written below a letter if a letter multiplier
    *           - multiplier written next to final score if word multiplier
    *       b. give letters that are placed but not submitted yet a grey tone to show that they can still be moved
    *       c. add conditional that letters from previous rounds do not scale while mouseOver
*   3. ERRORS
*
*
* TODO DONE:
*   1. move letter from board to player dock (only if it was placed in the same round)
*   2. move placedLetter state to Game component
*   3. add constrictions on finish button
*       a. starting letter of round 1 needs to be in middle tile
*       b. are any letters placed on board
*       c. are letters placed in a straight line
*       d. every rounds words need to be in contact with main placedLetters graph
*   4. a letter placed in a previous round cannot be selected
*   5. calculate score formed out of new words
*   6. increment scoreboard with new score
*   7. complete legend info table
*   8. when a new round is started, replace empty player letter slots with new letters from reserve
*   9. if round 1, you need to place at least 2 letters
*
* TODO ERRORS DONE:
*   1. error when placing only 1 letter at the start of the game
*   2. error when no more reserves are present to replace the played letters
*   3. promises take time to finish, error with non-connected letters: letters refill
* */