import React from 'react'
import '../css/tile.css'

/*  Tile renders a tile of a board game and uses a conditional to know which tile-type to render
*   Passed props: multiplier
*   Returns: Tile component
* */
export class Tile extends React.Component {
    render() {
        let color = "#52A793";
        switch(this.props.multiplier) {
            case "w3": color = "#9D322F"; break; //triple word
            case "w2": color = "#AF805E"; break; //double word
            case "l3": color = "#526AA7"; break; //triple letter
            case "l2": color = "#FACC7A"; break; //double letter
            default: color = "#52A793"; //no multiplier
        }
        return (
            <button className="tile" style={{backgroundColor: color}} onClick={this.props.handleTileClick}/>
        )
    }
}
