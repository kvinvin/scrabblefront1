import React from "react";
const axios = require('axios/index');

//This code was kept to show a method used to create a highscore list inefficiently. A lot of repetitive code is used
/*export class BestPlayersList extends React.Component {
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
        return (<div className="legendRectangle">
            <div className="textStyle" style={{top: "8px", height: "55px"}}>Best Players</div>
            <div className="tileInformation">
                <div className="square" style={{backgroundColor: "#FACC7A"}}>
                    <div className="textStyle" style={{top: "8px"}}>
                        {this.state.topPlayers[0].highScore}
                    </div>
                </div>
                <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                    {this.state.topPlayers[0].username}
                </div>
            </div>
            <div className="tileInformation">
                <div className="square" style={{backgroundColor: "#526AA7"}}>
                    <div className="textStyle" style={{top: "8px"}}>
                        {this.state.topPlayers[1].highScore}
                    </div>
                </div>
                <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                    {this.state.topPlayers[1].username}
                </div>
            </div>
            <div className="tileInformation">
                <div className="square" style={{backgroundColor: "#AF805E"}}>
                    <div className="textStyle" style={{top: "8px"}}>
                        {this.state.topPlayers[2].highScore}
                    </div>
                </div>
                <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                    {this.state.topPlayers[2].username}
                </div>
            </div>
            <div className="tileInformation">
                <div className="square" style={{backgroundColor: "#9D322F"}}>
                    <div className="textStyle" style={{top: "8px"}}>
                        {this.state.topPlayers[3].highScore}
                    </div>
                </div>
                <div className="textStyle" style={{top: "6px", textAlign: "left"}}>
                    {this.state.topPlayers[3].username}
                </div>
            </div>
        </div>)
    };
}
*/