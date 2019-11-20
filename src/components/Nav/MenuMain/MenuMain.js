import React, {Component} from 'react';
import classes from './MenuMain.module.css';
import {NavLink} from 'react-router-dom';
import Backdrop from '../../UI/Backdrop/Backdrop';

const links = [
    {to: '/', label: 'Список тестов', exact: true},
    {to: '/auth', label: 'Авторизация', exact: false},
    {to: '/quiz-creator', label: 'Создать тест', exact: false},
];

class MenuMain extends Component {
    // закрываем меню при клике по ссылке - копируем с клика по "пустому месту"
    clickHandler = () => {
        this.props.backdropClick();
    }

    renderLinks() {
        return links.map((link, index) => {
            return (
                <li key={index}>
                    <NavLink
                        to={link.to}
                        exact={link.exact}
                        activeClassName={classes.active}
                        onClick={this.clickHandler}
                    >
                        {link.label}
                    </NavLink>
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
