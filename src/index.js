import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './generic/infoBox.css';
import {Game} from './game/components/gameIndex.js';
import {HomePage} from './homePage/homePageIndex.js';
import {AlertModal} from './generic/alertModal';

const axios = require('axios');



class Scrabble extends React.Component {
    state = {
        status: 'homePage', //homePage or game
        username: '',
        gameName: '',
        modalHidden: true,
        modalHeader: '',
        modalAlertMessage: '',
        modalButtonValue: '',
        loadGame: false
    };

    handleModalAlert = (modalInfo) => {
        this.setState({
            modalHidden: false,
            modalHeader: modalInfo.modalHeader,
            modalAlertMessage: modalInfo.modalAlertMessage,
            modalButtonValue: modalInfo.modalButtonValue
        })
    };

    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    };

    handleGameNameChange = (event) => {
        this.setState({gameName: event.target.value});
    };

    //check if all conditions are met and start a new game
    handleStartGame = async (event) => {
        //prevents the form from refreshing the page
        event.preventDefault();

        const userInput = {
            username: this.state.username,
            gameName: this.state.gameName
        };

        if (userInput.username !== '' && userInput.gameName !== '') {
            const response = await axios.post('/verifyNewGameInput', userInput);
            if (response.data.exists) {
                axios.get('/OK');
                this.handleModalAlert({
                    modalHeader: 'Ah, sorry about that!',
                    modalAlertMessage: 'This game name is already in use with this username. ' +
                        'Please use another game name!',
                    modalButtonValue: 'OK'
                });
            } else this.setState({status: "game"});
        } else this.handleModalAlert({
            modalHeader: 'Oops, seems like you forgot something here!',
            modalAlertMessage: 'Username or game name field is empty',
            modalButtonValue: 'Add info'
        })
    };

    getFullGame = async (username, gameName) => {
        this.setState ({
            status: 'game',
            username: username,
            gameName: gameName,
            loadGame: true
        })
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
        console.log('Logging in index ' + gameState);
        await axios.post('/saveAndExit', fullGameState);
        this.handleModalAlert({
            modalHeader: 'See you soon',
            modalAlertMessage: "You're game has been saved...",
            modalButtonValue: "OK"
        });
        this.setState({
            status: 'homePage',
            loadGame: false
        });
    };

    handleEndGame = async (score) => {
        const fullGameState = {
            username: this.state.username,
            gameName: this.state.gameName,
            saveData: true,
            score: score
        };
        await axios.post('/endGame', fullGameState);
        this.handleModalAlert({
            modalHeader: "Too bad you couldn't finish",
            modalAlertMessage: "You're stats have been updated ...",
            modalButtonValue: "OK"
        });
        this.setState({
            status: 'homePage',
            loadGame: false
        });
    };

    homePageOrGame() {
        const status = this.state.status;

        if (status === 'homePage') {
            return (
                <HomePage
                    handleUsernameChange = {this.handleUsernameChange}
                    handleGameNameChange = {this.handleGameNameChange}
                    handleStartGame = {this.handleStartGame}
                    username = {this.state.username}
                    gameName = {this.state.gameName}
                    handleModalAlert = {this.handleModalAlert}
                    getFullGame = {this.getFullGame}
                />
        )
        }
        else if (status === 'game') {
            return <Game
                username = {this.state.username}
                gameName = {this.state.gameName}
                handleSaveAndExit = {this.handleSaveAndExit}
                handleEndGame = {this.handleEndGame}
                handleModalAlert = {this.handleModalAlert}
                loadGame = {this.state.loadGame}
            />
        }
        else {
            throw Error('404: Page not found')
        }
    }

    hideModal = () => {
        this.setState({modalHidden: true})
    };

    render() {
        return (
            <div>
                {this.homePageOrGame()}
                <AlertModal
                    hidden = {this.state.modalHidden}
                    header = {this.state.modalHeader}
                    alertMessage = {this.state.modalAlertMessage}
                    buttonText = {this.state.modalButtonValue}
                    hideModal = {this.hideModal}
                />
            </div>
        )
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