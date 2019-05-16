//check that at least 1 letter was placed on the board
const areLettersPlaced = async (newLetters) => {
    if (newLetters.length === 0){
        throw ("You need to place some letters on the board before ending the round :)");
    }
};

//In first round, at least 2 letters need to be placed
const areTwoLettersPlacedInFirstRound = async (newLetters, round) => {
    if (newLetters.length < 2 && round === 1) {
        throw ("You need to place at least 2 letters in the first round");
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
        else throw ("To be able to end the first round, you need to place a letter on the center tile");
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
            if (xNew !== x1) throw ("All letters placed in this round need to be placed on the same line");
        }
        else {
            //otherwise calculates only vertical values
            let yNew = location % 15;
            if (yNew !== y1) throw ("All letters placed in this round need to be placed on the same line");
        }
    }
};

/*make sure all letters are in contact with each other.
* Previous functions have already checked that
*   - the center tile is used
*   - that the letters are on a straight line
*/
const areLettersConnected = async (newLetters, possibleLocations) => {

    let newLocations = newLetters.map(letter => letter.location);

    //i is used as an index marker to know which index in the array to compare
    let i = newLocations.length - 1;
    let logger = 0;
    //as long as letters are in the newLocations array, continue
    while (newLocations.length > 0 && logger < 100) {
        //to check if a letter is connected to the main graph
        if ((i >= 0) && possibleLocations.includes(newLocations[i])) {
            //if it is, remove that letter
            let connectedLocation = Number(newLocations.splice(i, 1));

            //and add its neighbours to the possibleLocations array
            let newPossibleLocations = [
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
                throw ("A letter is not in contact with the rest of the letters!");
            }

        }
        logger++;
    }
    return possibleLocations;
};
/*
const sortNewLetters = (newLetters) => {
    newLetters.sort((a,b) => {
        return a.location - b.location
    });
};
*/
const detectDirection = (newLetters) => {
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
        return "horizontal";
    }
    else if (y1 === y2) {
        return "vertical";
    }
    else {
        //since neither was true for the first 2 letters, return false since letters are not on a straight line
        return null;
    }
};

const filterLettersByLocation = (letters, location, x) => {
    return letters.filter(letter => (letter.location === (location + x)))
};

const extractWord = async (letter, placedLetters, newLetters, direction) => {
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
        let tmp = filterLettersByLocation(placedLetters, location, x);
        if (tmp.length > 0) {
            neighbors.push(tmp[0]);
            location = location + x;
        }
        else {
            tmp = filterLettersByLocation(newLetters, location, x);
            if (tmp.length > 0) {
                neighbors.push(tmp[0]);
                location = location + x;
            }
            else {
                return neighbors;
            }
        }

    }
};

const calculateIndividualWordScore = async (word) => {
    let score = 0;
    let wordMultiplier = 1;
    for (let i = 0; i < word.length; i++) {
        let letterMultiplier = 1;
        switch(word[i].multiplier){
            case "w2": wordMultiplier = wordMultiplier * 2; break;
            case "w3": wordMultiplier = wordMultiplier * 3; break;
            case "l2": letterMultiplier = letterMultiplier * 2; break;
            case "l3": letterMultiplier = letterMultiplier * 3; break;
            default: break;
        }
        //adds the score of the current letter with a letterMultiplier to the total word score
        score = score + (word[i].points * letterMultiplier);
    }
    return (score * wordMultiplier);
};

export const validateAllRequirementsExceptWordValidation = async (newLetters, round, possibleLocations) => {
    return Promise.all([
        areLettersPlaced(newLetters), //works
        areTwoLettersPlacedInFirstRound(newLetters, round), //works
        isSetInMiddle(newLetters, round), //works
        areLettersOnStraightLine(newLetters), //works
        areLettersConnected(newLetters, possibleLocations)
        ])
};

export const collectWords = async (newLetters, placedLetters) => {
    const words = [];
    let direction = "point";
    if (newLetters.length > 1) {
        direction = detectDirection(newLetters);
    }

    for (let  i = 0; i < newLetters.length; i++) {
        //if direction is vertical, then the vertical word has already been found, which is why I use !==
        if (direction !== "vertical" || i === 0) {
            let verticalWord = [newLetters[i]];
            await extractWord(newLetters[i], placedLetters, newLetters, "up")
                .then(async (firstWordPart) => {
                    verticalWord = verticalWord.concat(firstWordPart);
                    await extractWord(newLetters[i], placedLetters, newLetters, "down")
                        .then((secondWordPart) => {
                            verticalWord = verticalWord.concat(secondWordPart);
                        })
                });
            verticalWord.sort((a, b) => {
                return a.location - b.location
            });

            if (verticalWord.length > 1){
                words.push(verticalWord);
            }
        }

        if (direction !== "horizontal" || i === 0) {
            let horizontalWord = [newLetters[i]];
            await extractWord(newLetters[i], placedLetters, newLetters, "left")
                .then(async (firstWordPart) => {
                    horizontalWord = horizontalWord.concat(firstWordPart);
                    await extractWord(newLetters[i], placedLetters, newLetters, "right")
                        .then((secondWordPart) => {
                            horizontalWord = horizontalWord.concat(secondWordPart);
                        })
                });
            horizontalWord.sort((a, b) => {
                return a.location - b.location
            });

            if (horizontalWord.length > 1){
                words.push(horizontalWord);
            }
        }
    }
    return words;
};

//returns true if the word exists, false if it is not a word
export const analyzeWords = (words) => {
    return true;
    let wordInLetters = words.map(placedLetter => placedLetter.letter);
    //Dictionary.hasOwnProperty(wordInLetters)
};

export const calculateScore = async (words, oldScore) => {
    let score = oldScore;
    await words.map(async (word) =>
        score = score + await calculateIndividualWordScore(word));
    return score;
};

export const updateRound = (round) => {
    if ((round > 1 || (round === 1 && isSetInMiddle)) && areLettersConnected) {
        round++;
    }
    return round;
};