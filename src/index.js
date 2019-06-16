import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from "./game/gameIndex.js";
import {HomePage} from "./homePage/homePageIndex.js";

/*
function scrabble () {
    const [status, setStatus] = useState("homePage");
    const [username, setUsername] = useState("");
    const [gameName, setGameName] = useState("");

    let componentUI = null;

    if (status === "homePage") {
        componentUI = homePage(
            username,
            gameName,
            setUsername,
            setGameName,
            setStatus
            );
    }
    else if (status === "game") {
        componentUI = <Game
            username = {username}
            gameName = {gameName}
            handleSaveAndExit = {setStatus("homePage")}
        />;
    }
    else {
        componentUI = Error("404: Page not found");
    }
    return <div/>;
}*/

class Scrabble extends React.Component {
    state = {
            status: "homePage", //homePage or game
            username: "",
            gameName: "",
    };

    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    };

    handleGameNameChange = (event) => {
        this.setState({gameName: event.target.value});
    };

    //check if all conditions are met and start a new game
    handleStartGame = () => {
        if (this.state.username !== "" && this.state.gameName !== "") {
           this.setState({status: "game"})
        }
        else{
            alert("username or game name field is empty")
        }
    };

    //receives the state of a game session and moves it on to the DB
    handleSaveAndExit = async (gameState) => {
        console.log("Logging in index " + gameState);
        await fetch('/saveAndExit', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(gameState)
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
        b. games can be saved when save button is pressed
        c. username info can be cross referenced to save a new user or save new info to present user
        d. update user info when give up or game is completed
 */