import {validateAllRequirementsHelper} from "./helper/submitRequirements";
import {analyzeWords, collectWords} from "./helper/analyzeWord";

export const validateAllRequirements = async (newLetters, placedLetters, round, possibleLocations) => {
    const values = await validateAllRequirementsHelper(newLetters, round, possibleLocations);

    const newWords = await collectWords(newLetters, placedLetters);
    const validWords = await analyzeWords(newWords);

    return {
        possibleLocations: values[4],
        newWords: newWords,
        validWords: validWords
    };
};
