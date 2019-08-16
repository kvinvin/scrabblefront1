import axios from 'axios';

export const createGame = async () => {
    const response = await axios.get('/createGame');
    return response.data
};

//analogous to read function of CRUD calls
export const loadGame = async (props) => {
    const response = await axios.post('/getSavedGame', {username: props.username, gameName: props.gameName});
    return response.data
};

//analogous to update function of CRUD calls
export const saveGame = async (fullGameState) => {
    await axios.post('/saveAndExit', fullGameState);
};

//analogous to delete function of CRUD calls
export const endGame = async (fullGameState) => {
    await axios.post('/endGame', fullGameState);
};

export const searchGames = async (query) => {
    const response = await axios.post('/fetchUserGames', {query: query});
    return response.data
};

export const verifyNewGameInput = async (userInput) => {
    const response = await axios.post('/verifyNewGameInput', userInput);
    return response.data
};

export const getHighScore = async (type) => {
    const response = await axios.post('/getTopPlayers', {topPlayersType: type}); //options: bestHighScore, bestAverageScore, bestTotalScore
    return response.data
};