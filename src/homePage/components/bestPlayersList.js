import React from "react";
import {IndividualHighscorePlayer} from "./individualHighscorePlayer";
import axios from 'axios';

export class BestPlayersList extends React.Component {
    state = {
        topPlayers: [
            {
                username: 'First',
                highScore: 573,
                gamesPlayed: 33
            },
            {
                username: 'Second',
                highScore: 73,
                gamesPlayed: 33
            },
            {
                username: 'Third',
                highScore: 30,
                gamesPlayed: 33
            },
            {
                username: 'Fourth',
                highScore: 5,
                gamesPlayed: 33
            },
        ]
    };

    getHighScore = async (type) => {
        const response = await axios.post('/getTopPlayers', {topPlayersType: type}); //options: bestHighScore, bestAverageScore, bestTotalScore
        this.setState({topPlayers: response.data.topPlayers});
    };

    componentDidMount() {
        this.getHighScore("bestHighScore");
    };

    render() {
        let i = 0;
        const players = this.state.topPlayers.map(topPlayer => {
            let color ='';
            switch (i) {
                case 0: color = "#FACC7A"; break;
                case 1: color = "#526AA7"; break;
                case 2: color = "#AF805E"; break;
                default: color = "#9D322F"
            }
            i++;
            return <IndividualHighscorePlayer color = {color} player = {topPlayer}/>
        });
        return (<div className="legendRectangle">
            <div className="textStyle" style={{top: "8px", height: "55px"}}>Best Players</div>
                {players}
            </div>
        )
    };
}