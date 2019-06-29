import {detectDirection} from './detectDirection'

//check that at least 1 letter was placed on the board
const areLettersPlaced = async (newLetters) => {
    if (newLetters.length === 0){
        throw String ("You need to place some letters on the board before ending the round :)");
    } else return true;
};

//In first round, at least 2 letters need to be placed
const areTwoLettersPlacedInFirstRound = async (newLetters, round) => {
    if (newLetters.length < 2 && round === 1) {
        throw String ("You need to place at least 2 letters in the first round");
    } else {
        return true;
    }
};

//checks that letters are on center piece during round 1
const isSetInMiddle = async (newLetters, round) => {
    if (round > 1) return true;
    else {
        let isSetInMiddle = false;
        for (let i = 0; i < newLetters.length; i++) {
            if (newLetters[i].location === 112) {
                isSetInMiddle = true;
            }
        }
        if (isSetInMiddle) return (isSetInMiddle);
        else throw String ("To be able to end the first round, you need to place a letter on the center tile");
    }
};

//function self-explanatory
const areLettersOnStraightLine = async (newLetters) => {
    if (newLetters.length === 1) return true;

    //states if further checks should go along the horizontal or vertical
    let direction = detectDirection(newLetters);

    //first letter coordinates
    const firstLocation = newLetters[0].location;
    const x1 = Math.floor(firstLocation / 15);
    const y1 = firstLocation % 15;

    for (let i = 2; i < newLetters.length; i++) {
        let location = newLetters[i].location;
        //calculates only horizontal values
        if (direction === "horizontal"){
            let xNew = Math.floor(location / 15);
            if (xNew !== x1) throw String ("All letters placed in this round need to be placed on the same line");
        }
        else {
            //otherwise calculates only vertical values
            let yNew = location % 15;
            if (yNew !== y1) throw String ("All letters placed in this round need to be placed on the same line");
        }
    }
    return true;
};

//make sure all letters are in contact with each other
const areLettersConnected = async (newLetters, possibleLocations) => {
    let newLocations = newLetters.map(letter => letter.location);
    //i is used as an index marker to know which index in the array to compare
    let i = newLocations.length - 1;
    let connectedLocation;
    let newPossibleLocations = [];

    //as long as letters are in the newLocations array, continue
    while (newLocations.length > 0) {
        //to check if a letter is connected to the main graph
        if ((i >= 0) && possibleLocations.includes(newLocations[i])) {
            //if it is, remove that letter
            connectedLocation = Number(newLocations.splice(i, 1));

            //and add its neighbours to the possibleLocations array
            newPossibleLocations = [
                connectedLocation - 15,
                connectedLocation + 15,
                connectedLocation - 1,
                connectedLocation + 1
            ];

            possibleLocations = possibleLocations.concat(newPossibleLocations);

            //remove duplicates
            possibleLocations = Array.from(new Set(possibleLocations));

            //now the letter was removed and the possible letters were added to the list, start while loop again
            //by checking from the end again
            i = newLocations.length;
        }
        else {
            //check one index lower of the newLocations
            i--;
            if (i < 0 ) {
                throw String ("A letter is not in contact with the rest of the letters!");
            }
        }
    }
    return possibleLocations;
};

export const validateAllRequirementsHelper = (newLetters, round, possibleLocations) => {
    return Promise.all([
        areLettersPlaced(newLetters), //returns true if passed, else throws String
        areTwoLettersPlacedInFirstRound(newLetters, round), //returns true if passed, else throws String
        isSetInMiddle(newLetters, round), //returns true if passed, else throws String
        areLettersOnStraightLine(newLetters), //returns true if passed, else throws String
        areLettersConnected(newLetters, possibleLocations) //side effect: returns new possibleLocations
    ]);
};