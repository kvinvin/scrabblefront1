import React from 'react';
import axios from 'axios';
import {FoundGameButton} from './foundGameButton'
import {SearchForm} from "./searchGameForm";

export class SearchGameContainer extends React.Component {
    state = {
        username: '',
        gameNames: []
    };

    handleSearchGame = async (event) => {
        //prevents the form from refreshing the page
        event.preventDefault();

        const query = this.state.username;

        let modalHeader,
            modalAlertMessage,
            modalButtonValue;

        if (query !== '') {
            const response = await axios.post('/fetchUserGames', {query: query});

            if (response.data.exists === 2) {
                this.setState({gameNames: response.data.games});
                axios.get('/OK')
            }
            //0 = no user, 1 = user exists but no games, 2 = user and games found
            switch (response.data.exists) {
                case 0:
                    modalHeader = 'WANTED, BUT NOT FOUND';
                    modalAlertMessage = 'The searched user could not be found...';
                    modalButtonValue = 'Change input';
                    break;
                case 1:
                    modalHeader = 'You got nothing on you';
                    modalAlertMessage = 'No games have been saved for this user...';
                    modalButtonValue = 'OK';
                    break;
                case 2: return;
                default:
                    modalHeader = 'Weird things happening';
                    modalAlertMessage = 'Try doing something else for a while';
                    modalButtonValue = 'OK';

            }
        } else {
            modalHeader = 'When nothing is searched, nothing is found...';
            modalAlertMessage = 'Search saved games by typing in a username!';
            modalButtonValue = 'Add query';
        }
        this.props.handleModalAlert({
            modalHeader: modalHeader,
            modalAlertMessage: modalAlertMessage,
            modalButtonValue: modalButtonValue
        })

    };

    handleQueryChange = (event) => {
        this.setState({username: event.target.value});
    };

    getFullGame = (gameName) => {
        this.props.getFullGame(this.state.username, gameName);
    };

    render() {
        const foundGameList = this.state.gameNames.map((gameName) => {
            return (
                <FoundGameButton
                    hidden = {this.state.hidden}
                    gameName = {gameName}
                    getFullGame = {this.getFullGame}
                />
            )});
        return (
            <div className="searchGame">
                <SearchForm
                    handleSearchGame = {this.handleSearchGame}
                    handleQueryChange = {this.handleQueryChange}
                />
                {foundGameList}
            </div>
        )
    };
}

