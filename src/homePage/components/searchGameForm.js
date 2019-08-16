import React from 'react';

export const SearchForm = (props) => {
    return (
        <form onSubmit = {props.handleSearchGame}>
            <div className="autocomplete">
                <input id="userInput"
                       type="text"
                       name="savedGames"
                       placeholder="Search saved games by user"
                       onChange = {props.handleQueryChange}
                />
            </div>
            <input type="submit" value="SEARCH"/>
        </form>
    )
};