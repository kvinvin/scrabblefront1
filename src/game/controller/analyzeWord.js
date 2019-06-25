//const fs = require('fs');
//const dictionaryUnSplit = fs.readFileSync('./scrabble_dictionary.txt', 'utf8');
//const dictionary = dictionaryUnSplit.split('\n');
const axios = require('axios');

/*const findInDictionary = (word, startingIndex, length) => {
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
};*/

const analyzeWordBack = async (word) => {
    const response = await axios.post('/validateWord', word);
    if (!response.data.exists) throw String ("One of the words you played is not a word"); //returns a boolean that is true if word exists
};

const analyzeWordFront = (word) => {

};

export const analyzeWord = async (word) => {
    /* Value changed in program itself
     * backend:  sends an API request to search for the word on Node.js server
     * frontend: finds word in Browser with a sample dictionary
     */
    const searchType = 'backend';

    if (searchType === 'backend') return await analyzeWordBack (word);
    else if (searchType === 'frontend') return analyzeWordFront (word);
    else throw Error('The value should be either "frontend" or "backend"');

}