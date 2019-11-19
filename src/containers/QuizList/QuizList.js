import React, { Component } from 'react';
import classes from './QuizList.module.css';
import {NavLink} from 'react-router-dom';
import Loader from '../../components/UI/Loader/Loader';
import {connect} from 'react-redux';
import {fetchQuizes} from '../../store/actions/quiz';

class QuizList extends Component {

    // список тестов хранили в State => переехал в Redux

    renderQuizes() {
        // получаем список тестов (с бэка) из Redux
        return this.props.quizes.map(quiz => {
            return (
                <li key={quiz.id} >
                    <NavLink to={'/quiz/' + quiz.id}>
                        {quiz.name}
                    </NavLink>
                </li>
            )
        });
    }

    componentDidMount() {
        this.props.fetchQuizes();
        // здесь был запрос данных с сервера, но он ушел в action
    }

    render() {
        return (
            <div className={classes.QuizList}>
                <div>
                    <h1>Список тестов</h1>

                    {
                        this.props.loading // && this.props.quizes.length !== 0
                            ? <Loader />
                            :   <ul>
                                    {this.renderQuizes()}
                                </ul>
                    }
                </div>
            </div>

        )
    }    
}

function mapStateToProps(state) {
    return {
        quizes: state.quiz.quizes,
        loading: state.quiz.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchQuizes: () => dispatch(fetchQuizes())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuizList);