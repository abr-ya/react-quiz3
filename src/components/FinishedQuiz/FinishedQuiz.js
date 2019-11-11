import React from 'react';
import classes from './FinishedQuiz.module.css';
import Button from '../UI/Button/Button';


const FinishedQuiz = props => {
    console.log(props.results); // статусы ответов на вопросы по их id

    // подсчёт кол-ва правильных ответов
    const successCount = Object.keys(props.results).reduce((total, key) => {
        if (props.results[key] === 'success') {
            total++;
        }
        return total;
    }, 0);
    
    return (
        <div className={classes.FinishedQuiz}>
            <ul>
                {
                    props.quiz.map((quizItem, index) => {
                        console.log(props.results[quizItem.id]);
                        const cls = [
                            'fa',
                            // иконка
                            props.results[quizItem.id] === 'success' ? 'fa-check' : 'fa-times',
                            // цвет:
                            classes[props.results[quizItem.id]]
                        ]

                        return (
                            <li key={index}>
                                <strong>{index + 1}</strong>&nbsp;
                                {quizItem.question}
                                <i className={cls.join(' ')}/>
                            </li>                            
                        )
                    })
                }
            </ul>

            <p>Правильно {successCount} из {props.quiz.length}.</p>

            <div>
                <Button onClick={props.onRetry} type='primary'>Повторить</Button>
                <Button type='success'>Перейти к списку</Button>
            </div>

        </div>
    )
}

export default FinishedQuiz;
