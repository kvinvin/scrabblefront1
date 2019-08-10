import React from 'react';
import './homePageIndex.css';
import '../generic/title.css';
import './css/searchGame.css';
import {SearchGame} from "./components/searchGame";
import {NewGameForm} from "./components/newGameForm";
import {BestPlayersList} from "./components/bestPlayersList";

//HomePage renders the homepage. This is an example of a stateless functional presentational component
export const HomePage = (props) => {
    return (
        <div className = "homePage">
            <div/>
            <div className="titleBox">
                <div className="title">SCRABBLE</div>
                <hr className="titleLine"/>
            </div>
            <div/>
            <SearchGame
                handleModalAlert = {props.handleModalAlert}
                getFullGame = {props.getFullGame}
                handleUsernameChange = {props.handleUsernameChange}
                handleGameNameChange = {props.handleGameNameChange}
            />
            <NewGameForm
                handleStartGame = {props.handleStartGame}
                handleUsernameChange = {props.handleUsernameChange}
                handleGameNameChange = {props.handleGameNameChange}
            />
            <BestPlayersList/>
        </div>
    )
};

// A class component as a comparison to the functional component: 24 LOC (functional) vs 28 LOC
// also, functional component has less boilerplate code
/*




export class HomePage extends React.Component {
    render () {
        return (
            <div className = "homePage">
                <div/>
                <div className="titleBox">
                    <div className="title">SCRABBLE</div>
                    <hr className="titleLine"/>
                </div>
                <div/>
                <SearchGame
                    handleModalAlert = {this.props.handleModalAlert}
                    getFullGame = {this.props.getFullGame}
                    handleUsernameChange = {this.props.handleUsernameChange}
                    handleGameNameChange = {this.props.handleGameNameChange}
                />
                <NewGameForm
                    handleStartGame = {this.props.handleStartGame}
                    handleUsernameChange = {this.props.handleUsernameChange}
                    handleGameNameChange = {this.props.handleGameNameChange}
                />
                <BestPlayersList/>
            </div>
        )
    }
}*/
