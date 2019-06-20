import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from "./game/gameIndex.js";
import {HomePage} from "./homePage/homePageIndex.js";
const axios = require('axios');


class Scrabble extends React.Component {
    state = {
            status: "homePage", //homePage or game
            username: "",
            gameName: ""
    };

    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    };

    handleGameNameChange = (event) => {
        this.setState({gameName: event.target.value});
    };

    //check if all conditions are met and start a new game
    handleStartGame = async () => {
        const userInput = {
            username: this.state.username,
            gameName: this.state.gameName
        };
        if (this.state.username !== "" && this.state.gameName !== "") {
            const response = await axios.post('/startGame', userInput);
                /*fetch('/startGame', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userInput)
            });*/
            const userInputIsTaken = response.body.result;
            //this.setState({status: 'game'});
            if (userInputIsTaken) {this.setState({status: "game"})}
            else {alert("Please use another game name, this game name is already in use for this user");}
        }
        else{
            alert("username or game name field is empty")
        }
    };

    //receives the state of a game session and moves it on to the DB
    handleSaveAndExit = async (gameState) => {
        const fullGameState = {
            gameName: this.state.gameName,
            username: this.state.username,
            reserveLetters: gameState.reserveLetters,
            playerLetters: gameState.playerLetters,
            placedLetters: gameState.placedLetters,
            words: gameState.words,
            round: gameState.round,
            possibleLocations: gameState.possibleLocations,
            score: gameState.score
        };
        console.log("Logging in index " + gameState);
        await fetch('/saveAndExit', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(fullGameState)
        });
        this.setState({status: "homePage"});
    };

    homePageOrGame() {
        const status = this.state.status;

        if (status === "homePage") {
            return <HomePage
                handleUsernameChange = {this.handleUsernameChange}
                handleGameNameChange = {this.handleGameNameChange}
                handleStartGame = {this.handleStartGame}
                username = {this.state.username}
                gameName = {this.state.gameName}
            />
        }
        else if (status === "game") {
            return <Game
                username = {this.state.username}
                gameName = {this.state.gameName}
                handleSaveAndExit = {this.handleSaveAndExit}
            />
        }
        else {
            throw Error("404: Page not found")
        }
    }

    render() {
        return this.homePageOrGame()
    }
}


ReactDOM.render(
    <Scrabble/>,
    document.getElementById('root')
);


/*
TODO:
    1. finish to do-list in gameIndex
    2. design home page
    3. add functionality to home page buttons and forms
    4. connect to server so that:
        a. words can be verified
        b. games can be saved when save button is pressed DONE
        c. username info can be cross referenced to save a new user or save new info to present user
        d. update user info when give up or game is completed
 */