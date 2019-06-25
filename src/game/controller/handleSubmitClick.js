import {validateAllRequirements} from "./helper/submitRequirements";
import {detectDirection} from "./helper/detectDirection";


const filterLettersByLocation = (letters, location, x) => {
    return letters.filter(letter => (letter.location === (location + x)))
};

const extractWord = async (letter, placedLetters, newLetters, direction) => {
    let searchMore = true;
    let neighbors = [];
    let location = letter.location;
    let x = 0;

    switch (direction) {
        case "up":      x = -15;    break;
        case "down":    x = 15;     break;
        case "left":    x = -1;     break;
        case "right":   x = 1;      break;
        default: return;
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
    score = score * wordMultiplier;
    return score;
};

export const validateAllRequirementsExceptWordValidation = async (newLetters, round, possibleLocations) => {
    return validateAllRequirements(newLetters, round, possibleLocations)
};

export const collectWords = async (newLetters, placedLetters) => {
    const words = [];
    let direction = "point";

    //find out the general direction of the word, either horizontal or vertical
    if (newLetters.length > 1) {
        direction = detectDirection(newLetters);
    }

    for (let  i = 0; i < newLetters.length; i++) {
        const newWord = [newLetters[i]];

        //if direction is vertical, then the vertical word has already been found, which is why I use !==
        if (direction !== "vertical" || i === 0) {
            let verticalWord = [];
            const upperWordPart = await extractWord(newLetters[i], placedLetters, newLetters, "up");
            const lowerWordPart = await extractWord(newLetters[i], placedLetters, newLetters, "down");

            verticalWord = newWord.concat(upperWordPart,lowerWordPart);

            verticalWord.sort((a, b) => {
                return a.location - b.location
            });

            if (verticalWord.length > 1){
                words.push(verticalWord);
            }
        }

        if (direction !== "horizontal" || i === 0) {
            let horizontalWord = [];
            const leftWordPart = await extractWord(newLetters[i], placedLetters, newLetters, "left");
            const rightWordPart = await extractWord(newLetters[i], placedLetters, newLetters, "right");

            horizontalWord = newWord.concat(leftWordPart, rightWordPart);

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
    let newWordsScore = [];
    let newIndividualScore = 0;
    let totalNewScore=  0;

    await words.map(async (word) => {
        newIndividualScore = await calculateIndividualWordScore(word);
        totalNewScore = totalNewScore + newIndividualScore;
        newWordsScore.push(newIndividualScore);
    });

    score = score + totalNewScore;

    alert("New Points added from words played: \n Previous score: "
        + oldScore
        + "\n Added points: + "
        + newWordsScore.join(" + ")
        + "\n New Total Score: "
        + score
    );

    return score;
};