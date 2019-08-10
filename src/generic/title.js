import React from 'react'
import './title.css'

export class Title extends React.Component {
    render() {
        return (
            <div className="titleBox">
                <div className="title">{this.props.gameName}</div>
                <hr className="titleLine"/>
            </div>
        )
    }
}