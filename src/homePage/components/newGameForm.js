import React from 'react';

export const NewGameForm = (props) => {
    return (
        <div className = "newGame">
            <form onSubmit = {props.handleStartGame}>
                <label>
                    <input
                        type = "text"
                        value = {props.username}
                        onChange = {props.handleUsernameChange}
                        placeholder = "Username"
                    /><br/><br/>
                    <input
                        type = "text"
                        name = "gameName"
                        value = {props.gameName}
                        onChange = {props.handleGameNameChange}
                        maxLength = "8"
                        placeholder = "Game name"
                    /><br/><br/>
                    <input type="submit" value="NEW GAME"/>
                </label>
            </form>
        </div>
    )
};