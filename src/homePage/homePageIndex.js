import React from 'react';
import './homePageIndex.css';
import '../game/Static Components/decoration.css';
import './fallingLetters.css';
import './autoCompleteForm.css';

export class HomePage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            savedGames: ['hello', 'game5', 'test', 'york', 'alabama'],
            topPlayers: [
                {
                    username: 'France93',
                    score: 4573,
                    gamesPlayed: 33
                },
                {
                    username: 'Daniela',
                    score: 3466,
                    gamesPlayed: 26
                },
                {
                    username: 'Wes Anderson',
                    score: 3109,
                    gamesPlayed: 27
                },
                {
                    username: 'Kevin',
                    score: 2197,
                    gamesPlayed: 18
                }
                ]
        }
    }

    render () {
        return (
            <div className = "homePage">
                <div/>
                <div className="titleBox">
                    <div className="title">SCRABBLE</div>
                    <hr className="titleLine"/>
                </div>
                <div/>
                <div className = "searchGame">
                    <form autoComplete="off">
                        <div className="autocomplete">
                            <input id="userInput" type="text" name="savedGames" placeholder="Search saved games..."/>
                        </div>
                        <input type="submit"/>
                    </form>
                </div>
                <div className = "newGame">
                    <form onSubmit = {this.props.handleStartGame}>
                        <label>
                            <input
                                type = "text"
                                value = {this.props.username}
                                onChange = {this.props.handleUsernameChange}
                                placeholder = "Username"
                            /><br/><br/>
                            <input
                                type = "text"
                                name = "gameName"
                                value = {this.props.gameName}
                                onChange = {this.props.handleGameNameChange}
                                maxLength = "6"
                                placeholder = "Game name"
                            /><br/><br/>
                            <input type="submit" value="START GAME"/>
                        </label>
                    </form>
                </div>
                <div className="legendRectangle">
                    <div className="textStyle" style={{top: "8px", height: "55px"}}>Best Players</div>
                    <div className="tileInformation">
                        <div className="square" style={{backgroundColor: "#FACC7A"}}>
                            <div className= "textStyle" style={{top: "8px"}}> 1. </div>
                        </div>
                        <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                            {this.state.topPlayers[0].username}
                        </div>
                    </div>
                    <div className="tileInformation">
                        <div className="square" style={{backgroundColor: "#526AA7"}}>
                            <div className= "textStyle" style={{top: "8px"}}> 2. </div>
                        </div>
                        <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                            {this.state.topPlayers[1].username}
                        </div>
                    </div>
                    <div className="tileInformation">
                        <div className="square" style={{backgroundColor: "#AF805E"}}>
                            <div className= "textStyle" style={{top: "8px"}}> 3. </div>
                        </div>
                        <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                            {this.state.topPlayers[2].username}
                        </div>
                    </div>
                    <div className="tileInformation">
                        <div className="square" style={{backgroundColor: "#9D322F"}}>
                            <div className= "textStyle" style={{top: "8px"}}> 4. </div>
                        </div>
                        <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                            {this.state.topPlayers[3].username}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


/**
 * TODO:
 *  1. Design static website elements
     *  a. highscore list
 *      b. saved games corner
 *      c. form in center with nicer UI
 *      d. Scrabble as title
 */
