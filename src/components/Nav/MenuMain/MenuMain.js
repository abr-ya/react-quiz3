import React, {Component} from 'react';
import classes from './MenuMain.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';

const links = [1,2,3]

class MenuMain extends Component {
    renderLinks() {
        return links.map((link, index) => {
            return (
                <li key={index}>
                    <a href="#">Link {link}</a>
                </li>
            )
        })
    }

    render() {
        const cls = [classes.MenuMain]

        if (!this.props.isOpen) {
            cls.push(classes.Close);
        }

        return (
            <React.Fragment>
                <nav className={cls.join(' ')}>
                    <ul>
                        { this.renderLinks() }
                    </ul>
                </nav>
                { this.props.isOpen ? <Backdrop
                                        onClick={this.backdropClickHandler}
                                        backdropClick={this.props.backdropClick}
                                        /> : null} 
            </React.Fragment>

        )
    }
}

export default MenuMain;
