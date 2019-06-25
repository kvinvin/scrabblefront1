const fs = require('fs');
const dictionaryUnSplit = fs.readFileSync('./scrabble_dictionary.txt', 'utf8');
const dictionary = dictionaryUnSplit.split('\n');

function findInDictionary(word, startingIndex, length) {
    if (startingIndex <= (length-1)) {
        const i = length/2;
        const middleWord = dictionary[i];
        if (word < middleWord) {
            return findInDictionary(word, startingIndex, i)
        }
        else if (word > middleWord) {
            return findInDictionary(word, i, length)
        }
        else{
            return true
        }
    }
    else {
        return false;
    }
}

export function analyzeWord (word) {
    return findInDictionary(word, 0, dictionary.length);
}