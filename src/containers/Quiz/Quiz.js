import React, { Component } from 'react';
import classes from './Quiz.module.css';
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz';
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz';
import axios from '../../axios/axios';
import Loader from '../../components/UI/Loader/Loader';

// проверяем импорт классов
//console.log(classes);

class Quiz extends Component {
    state = {
        results: {},
        isFinished: false,
        activeQuestion: 0,
        answerState: null,
        quiz: [],
        loading: true
    }

    onAnswerClickHandler = (answerId) => {
        //console.log(answerId, this.state.activeQuestion, this.isQuizFinished());

        // избегаем накручивания повторным кликом по правильному ответу во вреия таймаута
        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0];
            if (this.state.answerState[key] === 'success') {
                return
            }
        }

        // текущий вопрос
        const question = this.state.quiz[this.state.activeQuestion];

        //
        const results = this.state.results;

        // если ответ правильный
        if(question.rightAnswerId === answerId) {
            // если пусто - ответили правильно с первой, иначе - подобрали
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            this.setState({
                answerState: {[answerId]: 'success'},
                results
            })

            // ждём секунду, чтобы увидеть результат
            const timeout = window.setTimeout(() => {
                // последний вопрос?
                if (this.isQuizFinished()) {
                    console.log('Вопросы кончились!')
                    this.setState({
                        isFinished: true,
                    });
                } else {
                    // переключение на следующий вопрос
                    console.log('Переключаем!')
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null // сбрасываем подсветку варианта
                    });                 
                }

                window.clearTimeout(timeout);
            }, 1000)
        // неправильный ответ
        } else {
            results[question.id] = 'error';
            this.setState({
                answerState: {[answerId]: 'error'},
                results
            })
        }
    }

    isQuizFinished() {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }

    retryHandler = () => {
        this.setState({
            results: {},
            isFinished: false,
            activeQuestion: 0,
            answerState: null,
        })
    }

    // componentDidMount() {
    //     console.log(this.props.match.params.id);
    // }

    async componentDidMount() {
        const id = this.props.match.params.id;
        try {
            const response = await axios.get(`quizes/${id}.json`);
            const quiz = response.data;

            this.setState({
                quiz,
                loading: false
            });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Пожалуйста, ответьте на все вопросы</h1>

                    {
                        this.state.loading
                            ? <Loader />
                            :   this.state.isFinished
                                    ? <FinishedQuiz
                                        results={this.state.results}
                                        quiz={this.state.quiz}
                                        onRetry={this.retryHandler}
                                        />
                                    : <ActiveQuiz
                                        answers={this.state.quiz[this.state.activeQuestion].answers}
                                        question={this.state.quiz[this.state.activeQuestion].question}
                                        onAnswerClick={this.onAnswerClickHandler}
                                        quizLength={this.state.quiz.length}
                                        answerNumber={this.state.activeQuestion + 1}
                                        state={this.state.answerState}
                                        />
                    }
                    
                </div>
            </div>
        );
    }
}

export default Quiz;
