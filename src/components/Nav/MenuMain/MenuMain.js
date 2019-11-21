import React, {Component} from 'react';
import classes from './MenuMain.module.css';
import {NavLink} from 'react-router-dom';
import Backdrop from '../../UI/Backdrop/Backdrop';
import {connect} from 'react-redux';


class MenuMain extends Component {
    // закрываем меню при клике по ссылке - копируем с клика по "пустому месту"
    clickHandler = () => {
        this.props.backdropClick();
    }

    renderLinks(links) {
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

        // ссылки, общие для всех пользователей
        const links = [
            {to: '/', label: 'Список тестов', exact: true},   
        ];

        // если пользователь в системе
        if (this.props.isAuth) {
            links.push({to: '/quiz-creator', label: 'Создать тест', exact: false});
            links.push({to: '/logout', label: 'Выйти', exact: false});
        } else {
            links.push({to: '/auth', label: 'Авторизация', exact: false});
        }

        return (
            <React.Fragment>
                <nav className={cls.join(' ')}>
                    <ul>
                        { this.renderLinks(links) }
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

function mapStateToProps(state) {
    return {
      isAuth: !!state.auth.token
    }
  }

export default connect(
    mapStateToProps,
    null
)(MenuMain);
