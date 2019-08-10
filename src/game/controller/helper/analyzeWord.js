import {detectDirection} from "./detectDirection";
const axios = require("axios");

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

//find all the new words placed in the game
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
export const analyzeWords = async (words) => {
    const response = await axios.post('/validateWords', words);
    return response.data.isValid;
};