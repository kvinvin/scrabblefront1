import React, {useState} from 'react';
import axios from 'axios'
import {HomePage} from "./homePage/homePageIndex";
import {Game} from "./game/components/gameIndex";
import ReactDOM from "react-dom";

/*
TODO:
    -I tried to use React hooks here. This somehow failed, needs more work and effort to try it out...
 */


//check if all conditions are met and start a new game
const handleStartGame = async (event, username, gameName) => {
    //prevents the form from refreshing the page
    event.preventDefault();

    const userInput = {
        username: username,
        gameName: gameName
    };

    if (userInput.username !== "" && userInput.gameName !== "") {
        const response = await axios.post('/startGame', userInput);
        if (response.data.exists) {
            axios.get('/OK');
            alert('Please use another game name, this game name is already in use for this user');
        } else this.setState({status: "game"});
    } else alert("username or game name field is empty")
};

//receives the state of a game session and moves it on to the DB
const handleSaveAndExit = async (gameState, username, gameName, updateStatus) => {
    const fullGameState = {
        gameName: gameName,
        username: username,
        reserveLetters: gameState.reserveLetters,
        playerLetters: gameState.playerLetters,
        placedLetters: gameState.placedLetters,
        words: gameState.words,
        round: gameState.round,
        possibleLocations: gameState.possibleLocations,
        score: gameState.score
    };
    console.log("Logging in index " + gameState);
    await axios.post('/saveAndExit', fullGameState);
    updateStatus('homePage');
};

const handleEndGame = async (score, username, gameName, updateStatus) => {
    const fullGameState = {
        username: username,
        gameName: gameName,
        saveData: true,
        score: score
    };
    console.log("Logging in index " + score);
    await axios.post('/endGame', fullGameState);
    updateStatus('homePage');
};

const homePageOrGame = (status, username, gameName, updateUsername, updateGameName, updateStatus) => {
    if (status === "homePage") {
        return <HomePage
            handleUsernameChange = {(e) => {
                updateUsername(e.target.value)}}
            handleGameNameChange = {(e) => {
                updateGameName(e.target.value)}}
            handleStartGame ={(e) => {
                handleStartGame(e, username, gameName)
            }}
            username = {username}
            gameName = {gameName}
        />
    }
    else if (status === "game") {
        return <Game
            username = {username}
            gameName = {gameName}
            handleSaveAndExit = {(gameState) => {
                handleSaveAndExit(gameState, username, gameName, updateStatus)
            }}
            handleEndGame = {(score, gameName) => {
                handleEndGame(score, username, gameName, updateStatus)
            }}
        />
    }
    else {
        throw Error("404: Page not found")
    }
};

const Scrabble = async () => {
    const [status, updateStatus] = useState('homepage');
    const [username, updateUsername] = useState("");
    const [gameName, updateGameName] = useState("");

    homePageOrGame(status, username, gameName, updateUsername, updateGameName, updateStatus);
};

ReactDOM.render(
    <Scrabble/>,
    document.getElementById('root')
);