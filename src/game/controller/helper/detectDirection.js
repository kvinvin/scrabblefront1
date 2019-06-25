export const detectDirection = (newLetters) => {
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