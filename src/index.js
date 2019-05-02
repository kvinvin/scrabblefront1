import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {GiveUp, SaveAndExit, Submit} from './Static Components/gameButtons.js'
import {Legend, Title} from "./Static Components/decoration.js";
import {Board} from "./gameBoard.js";
import {PlayerInfo, PlayerLetters} from "./playerElements";
import Letters from "./letterData";

/*Game contains as state all the game-wide data to be saved*/
class Game extends React.Component {
    constructor (props) {
        super (props);

        this.generateArrayFromObjects = this.generateArrayFromObjects.bind(this);
        this.shuffle = this.shuffle.bind(this);

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


    //checks that letters are on center piece during round 1
    static isSetInMiddle(newLetters) {
        let isSetInMiddle = false;
        for (let i = 0; i < newLetters.length; i++) {
            if(newLetters[i].location === 112) {
                isSetInMiddle = true;
            }
        }
        return isSetInMiddle;
    }

    static areLettersOnStraightLine (newLetters) {
        if (newLetters.length === 1) return true;

        //states if further checks should go along the horizontal or vertical
        let horizontalDirection = false;

        //first letter coordinates
        const firstLocation = newLetters[0].location;
        const x1 = Math.floor(firstLocation / 15);
        const y1 = firstLocation % 15;

        //second letter coordinates
        const secondLocation = newLetters[1].location;
        const x2 = Math.floor(secondLocation / 15);
        const y2 = secondLocation % 15;

        //compare to see if further checks need to continue horizontal or vertical
        if (x1 === x2) {
            horizontalDirection = true;
        }
        else if (y1 === y2) {
            horizontalDirection = false;
        }
        else {
            //since neither was true for the first 2 letters, return false since letters are not on a straight line
            return false;
        }

        for (let i = 2; i < newLetters.length; i++) {
            let location = newLetters[i].location;
            //calculates only horizontal values
            if (horizontalDirection){
                let xNew = Math.floor(location / 15);
                if (xNew !== x1) return false;
            }
            else {
                //otherwise calculates only vertical values
                let yNew = location % 15;
                if (yNew !== y1) return false;
            }
        }
        return true;
    }

    /*make sure all letters are in contact with each other.
    * Previous functions have already checked that
    *   - the center tile is used
    *   - that the letters are on a straight line
    */
    areLettersConnected (newLetters) {
        console.log("Checking if all letters are in contact with each other");

        let possibleLocations = this.state.possibleLocations;
        let newLocations = newLetters.map(letter => letter.location);

        console.log("Possible locations from before: " + possibleLocations);
        console.log("New locations to be checked: " + newLocations);
        //i is used as an index marker to know which index in the array to compare
        let i = newLocations.length - 1;
        let logger = 0;
        //as long as letters are in the newLocations array, continue
        while (newLocations.length > 0 && logger < 100) {
            console.log("Run: " + logger);
            console.log("i: " + i);
            //to check if a letter is connected to the main graph
            if ((i >= 0) && possibleLocations.includes(newLocations[i])) {
                console.log("It fit on " + i + " with location " + newLocations[i]);
                //if it is, remove that letter
                let connectedLocation = Number(newLocations.splice(i, 1));

                //and add its neighbours to the possibleLocations array
                let newPossibleLocations = [
                    connectedLocation - 15,
                    connectedLocation + 15,
                    connectedLocation - 1,
                    connectedLocation + 1
                ];

                console.log(logger + ": Possible locations: " + newPossibleLocations);
                possibleLocations = possibleLocations.concat(newPossibleLocations);

                //remove duplicates
                possibleLocations = Array.from(new Set(possibleLocations));

                //now the letter was removed and the possible letters were added to the list, start while loop again
                //by checking from the end again
                i = newLocations.length;

                console.log(logger + ": Possible locations from before: " + possibleLocations);
                console.log(logger + ": New locations to be checked: " + newLocations);
            }
            else {
                //check one index lower of the newLocations
                console.log("Does not fit on index " + i);
                i--;
                if (i < 0 ) {
                    return false;
                }

            }
            logger++;
        }
        this.setState({possibleLocations: possibleLocations});
        return true;
    }

    extractWord(letter, newLetters, direction) {
        let searchMore = true;
        let neighbors = [];
        let location = letter.location;
        let x = 0;
        switch (direction) {
            case "up":
                x = -15;
                break;
            case "down":
                x = 15;
                break;
            case "left":
                x = -1;
                break;
            case "right":
                x = 1;
                break;
            default:
                return;
        }

        while (searchMore) {
            let tmp = this.state.placedLetters.filter(
                placedLetter => (placedLetter.location === (location + x)));
            if (tmp.length > 0) {
                console.log("Tmp1: " + tmp[0].letter);
                neighbors.push(tmp[0]);
                location = location + x;
            }
            else {
                tmp = newLetters.filter(newLetter => (newLetter.location === (location + x)));
                if (tmp.length > 0) {
                    console.log("Tmp2: " + tmp[0].letter);
                    neighbors.push(tmp[0]);
                    location = location + x;
                }
                else {
                    console.log("Neighbors:" + neighbors);
                    return neighbors;
                }
            }

        }
    }

    //returns true if the word exists, false if it is not a word
    analyzeWord(word) {
        let wordInLetters = word.map(placedLetter => placedLetter.letter);
        //Dictionary.hasOwnProperty(wordInLetters)
    }

    static calculateScore(word) {
        let score = 0;
        let wordMultiplier = 1;
        for (let i = 0; i < word.length; i++) {
            let letterMultiplier = 1;
            switch(word[i].multiplier){
                case "w2": wordMultiplier = wordMultiplier * 2; break;
                case "w3": wordMultiplier = wordMultiplier * 3; break;
                case "l2": letterMultiplier = letterMultiplier * 2; break;
                case "l3": letterMultiplier = letterMultiplier *3; break;
            }
            //adds the score of the current letter with a letterMultiplier to the total word score
            score = score + (word[i].points * letterMultiplier);
        }
        return (score * wordMultiplier);
    }

    refillPlayerLetters(){
        let reserveLetters = this.state.reserveLetters;
        const oldPlayerLetters = this.state.playerLetters;
        console.log("leftOvers: " + oldPlayerLetters);
        const newPlayerLetters = oldPlayerLetters.map(letter => {
            if(letter.letter === null) {
                return (reserveLetters.splice(0,1))[0];
            }
            return letter
        });
        this.setState({
            reserveLetters: reserveLetters,
            playerLetters: newPlayerLetters
        })
    }

    //makes sure that the letters placed fit all the right requirements before moving on to the next round
    handleSubmitClick () {
        //save initial values of state
        let round = this.state.round;
        let placedLetters = this.state.placedLetters;
        let newLetters = placedLetters.filter(letter => letter.roundPlaced === round);


        //in case no letters were added, alert player
        if (newLetters.length === 0){
            alert("You need to place some letters on the board before ending the round :)");
            return;
        }

        if (newLetters.length === 1 && round === 1) {
            alert("You need to place at least 2 letters in the first round");
            return;
        }
        //check that center tile is not empty when first round is being ended
        let isSetInMiddle = Game.isSetInMiddle(newLetters);
        if (round === 1 && !isSetInMiddle){
            alert("To be able to end the first round, you need to place a letter on the center tile");
            return;
        }

        //check that all elements are on a straight line
        let lettersAreOnStraightLine = Game.areLettersOnStraightLine (newLetters);
        if (!lettersAreOnStraightLine) {
            alert("All letters placed in this round need to be placed on the same line");
            return;
        }

        //check that the new letters are in contact with the old letters through some line
        let areLettersConnected = this.areLettersConnected(newLetters);
        console.log("Are letters connected:" + areLettersConnected);
        if (!areLettersConnected) {
            alert("A letter is not in contact with the rest of the letters!")
        }

        newLetters.sort((a,b) => {
            return a.location - b.location
        });
        let lettersOnly = newLetters.map(l => l.letter);
        //lettersOnly contains all the new letters placed in order
        console.log("New Word: " + lettersOnly);

        //Array that collects all created words
        let words = [];

        for (let  i = 0; i < newLetters.length; i++) {
            let verticalWord = (
                [newLetters[i]]
                    .concat(this.extractWord(newLetters[i], newLetters, "up")))
                .concat(this.extractWord(newLetters[i], newLetters, "down"));
            verticalWord.sort((a, b) => {
                return a.location - b.location
            });
            if (verticalWord.length > 1){
                words.push(verticalWord);
            }

            let horizontalWord = (
                [newLetters[i]]
                    .concat(this.extractWord(newLetters[i], newLetters, "left")))
                .concat(this.extractWord(newLetters[i], newLetters, "right"));
            horizontalWord.sort((a, b) => {
                return a.location - b.location
            });
            if (horizontalWord.length > 1){
                words.push(horizontalWord);
            }
        }
        let score = this.state.score;
        score = score + Game.calculateScore(words[0]);

        this.setState({words: words});
        this.setState({score: score});

        if ((round > 1 || (round === 1 && isSetInMiddle)) && areLettersConnected) {
            round++;
        }
        this.setState({round: round});

        this.refillPlayerLetters();
    }

    render() {
        return(
            <div className="game">
                <SaveAndExit/>
                <Title/>
                <GiveUp/>
                <PlayerInfo score = {this.state.score}/>
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
let shuffledReserveLetters = this.generateArrayFromObjects(Letters).then(value => this.shuffle(value));
console.log("SRL: " + shuffledReserveLetters);
let firstSeven = shuffledReserveLetters.splice(0,7);
*/
ReactDOM.render(
    <Game
        /*playerLetters = {firstSeven}
        reservedLetters = {shuffledReserveLetters}*/
    />,
    document.getElementById('root')
);


/*
* TODO:
*   1.! add constrictions on finish button
*           a. words formed need to be proper words
*               - to do this:
*                   1. extract words ALMOST DONE
*                   2. analyze words
*   2.  to achieve 5, generate a list of shuffled letters from letterData and save it in state.
*   3.  if round 1, you need to place at least 2 letters
*   4.  when a round is successfully ended, add a 10-second page showing how the score gets calculated
*           - darker background
*           - each tile in large (word and score)
*           - multiplier written below a letter if a letter multiplier
*           - multiplier written next to final score if word multiplier
*   5. ERRORS:
*       a. error when no more reserves are present to replace the played letters
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
*
* TODO ERRORS DONE:
*   1. error when placing only 1 letter at the start of the game
* */