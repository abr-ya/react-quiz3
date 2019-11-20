import React, { Component } from 'react';
import classes from './Quiz.module.css';
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz';
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz';
import Loader from '../../components/UI/Loader/Loader';
import {connect} from 'react-redux';
import {fetchQuizById, quizAnswerClick, retryQuiz} from '../../store/actions/quiz';

// проверяем импорт классов
//console.log(classes);

class Quiz extends Component {
    // state переносим в Redux

    // логику переносим в action

    // запускаем action загрузки теста
    async componentDidMount() {
        this.props.fetchQuizById(this.props.match.params.id);
    }

    // очистка стейт если тест прерван
    componentWillUnmount() {
        this.props.retryQuiz();
        // console.log('Выходим - сбрасываем!');
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Пожалуйста, ответьте на все вопросы</h1>

                    {
                        this.props.loading || !this.props.quiz // уточнить, не вырубаем ли мы лоадер так? UPD: ! + ||
                            ? <Loader />
                            :   this.props.isFinished
                                    ? <FinishedQuiz
                                        results={this.props.results}
                                        quiz={this.props.quiz}
                                        onRetry={this.props.retryQuiz}
                                        />
                                    : <ActiveQuiz
                                        answers={this.props.quiz[this.props.activeQuestion].answers}
                                        question={this.props.quiz[this.props.activeQuestion].question}
                                        onAnswerClick={this.props.quizAnswerClick}
                                        quizLength={this.props.quiz.length}
                                        answerNumber={this.props.activeQuestion + 1}
                                        state={this.props.answerState}
                                        />
                    }
                    
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        results: state.quiz.results,
        isFinished: state.quiz.isFinished,
        activeQuestion: state.quiz.activeQuestion,
        answerState: state.quiz.answerState,
        quiz: state.quiz.quiz,
        loading: state.quiz.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchQuizById: id => dispatch(fetchQuizById(id)),
        quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
        retryQuiz: () => dispatch(retryQuiz()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Quiz);
