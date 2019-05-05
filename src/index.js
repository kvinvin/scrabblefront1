import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from "./game/gameIndex.js";

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);


/*
* TODO:
*   1. LOGIC
    *       a. add constrictions on finish button
    *           - words formed need to be proper words
    *               1. extract words DONE
    *               2. analyze words
    *       b.  generate a list of shuffled letters from letterData and save it in state.
    *       c. detect (after submit is pressed) when no more letters are present in player letters and reserve letters and show
    *           - the score
    *           - its placement in the high score list
    *           - BUTTON: return to home
    *           - BUTTON: play again
*   2. DESIGN
    *       a. when a round is successfully ended, add a 10-second page showing how the score gets calculated
    *           - darker background
    *           - each tile in large (word and score)
    *           - multiplier written below a letter if a letter multiplier
    *           - multiplier written next to final score if word multiplier
    *       b. give letters that are placed but not submitted yet a grey tone to show that they can still be moved
    *       c. add conditional that letters from previous rounds do not scale while mouseOver
*   3. ERRORS
    *       a. promises take time to finish, error with non-connected letters: letters refill
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
*   9. if round 1, you need to place at least 2 letters
*
* TODO ERRORS DONE:
*   1. error when placing only 1 letter at the start of the game
*   2. error when no more reserves are present to replace the played letters
* */