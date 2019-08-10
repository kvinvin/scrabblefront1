import React from 'react';
import './alertModal.css'
export class AlertModal extends React.Component {
    render() {
        if (this.props.hidden) {
            return null;
        }
        else {
            return (
                <div className='modalBack'>
                    <div className='modalCSS'>
                        <h2>{this.props.header}</h2>
                        <h4>{this.props.alertMessage}</h4>
                        <button className='alertButton' onClick={this.props.hideModal}>{this.props.buttonText}</button>
                    </div>
                </div>
            )
        }
    }
};
