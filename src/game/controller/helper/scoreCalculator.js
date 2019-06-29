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