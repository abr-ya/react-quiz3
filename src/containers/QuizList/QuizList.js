import React, { Component } from 'react';
import classes from './QuizList.module.css';
import {NavLink} from 'react-router-dom';
import Loader from '../../components/UI/Loader/Loader';
import axios from 'axios';

export default class QuizList extends Component {

    // список будем хранить в State
    state = {
        quizes: [],
        loading: true,
    }

    renderQuizes() {
        // когда-нибудь мы будем забирать здесь список тестов с бэка
        return this.state.quizes.map(quiz => {
            return (
                <li key={quiz.id} >
                    <NavLink to={'/quiz/' + quiz.id}>
                        {quiz.name}
                    </NavLink>
                </li>
            )
        });
    }

    async componentDidMount() {
        try {
            const response = await axios.get('https://react-quiz-f1eb1.firebaseio.com/quizes.json');

            const quizes = []
            Object.keys(response.data).forEach((key, index) => {
                quizes.push({
                    id: key,
                    name: `Тест №${index + 1}`
                });
            })

            this.setState({
                quizes,
                loading: false,
            })
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className={classes.QuizList}>
                <div>
                    <h1>Список тестов</h1>

                    {
                        this.state.loading
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

