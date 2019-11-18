import React, { Component } from 'react';
import classes from './QuizCreator.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Select from '../../components/UI/Select/Select';
import {createControl, validate, validateForm} from '../../form/form';
import axios from 'axios';

// ускоряем подготовку вариантов ответа
// правильно ли, что всегда обязательно 4 варианта ответа?
function createOptionControl(num) {
    return createControl({
        label: `Вариант ${num}`,
        errorMessage: 'Значение не может быть пустым',
        id: num,
    },
    {required: true})
}

// очистка параметров формы
function createFormControls() {
    return {
        question: createControl({
            label: 'Введите вопрос',
            errorMessage: 'Вопрос не может быть пустым'
        }, {required: true}),
        option1: createOptionControl(1),
        option2: createOptionControl(2),
        option3: createOptionControl(3),
        option4: createOptionControl(4),
    }
}

export default class QuizCreator extends Component {
    state = {
        quiz: [],
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControls(),
    }

    submitHandler = e => {
        e.preventDefault();
    }

    // сохраняем вопрос
    addQuestionHandler = e => {
        e.preventDefault();

        const quiz = [...this.state.quiz];
        const index = quiz.length + 1;

        // деструктуризация чтобы избежать массивности
        const {option1, option2, option3, option4} = this.state.formControls;

        const questionItem = {
            id: index,
            question: this.state.formControls.question.value,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: option1.value, id: option1.id},
                {text: option2.value, id: option2.id},
                {text: option3.value, id: option3.id},
                {text: option4.value, id: option4.id},
            ]
        }

        quiz.push(questionItem);

        this.setState({
            quiz,
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls(),
        })
    }

    // обработчик создания теста
    // делаем функцию асинхронной
    createQuizHandler = async(e) => {
        e.preventDefault();

        // получившийся тест
        //console.log(this.state.quiz);        

        try {
            // асинхронное событие будет тут
            const response = await axios.post('https://react-quiz-f1eb1.firebaseio.com/quizes.json', this.state.quiz);
            console.log('Тест сохранен с ключом: ', response.data.name);

            // ответ получен - обнуляем State
            this.setState({
                quiz: [],
                isFormValid: false,
                rightAnswerId: 1,
                formControls: createFormControls(),
            })
        } catch (error) {
            console.log(error);
        }
    }

    changeHandler = (value, controlName) => {
        const formControls = {...this.state.formControls}; // чтобы не мутировать State
        const control = {...formControls[controlName]};

        control.touched = true;
        control.value = value;
        control.valid = validate(control.value, control.validation);

        formControls[controlName] = control;

        this.setState({
            formControls,
            isFormValid: validateForm(formControls),
        })
    }

    renderInputes() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName];

            // div создал потому, что на фрагмент он ругался, что нет key!((
            // наверное, проще от hr отказаться тут!
            return (
                <div key={index}>
                    <Input
                        key={controlName + index}
                        value={control.value}
                        valid={control.valid}
                        touched={control.touched}
                        label={control.label}
                        shouldValidate={!!control.validation}
                        errorMessage={control.errorMessage}
                        onChange={event => this.changeHandler(event.target.value, controlName)}
                    />
                    { index === 0 ? <hr /> : null }
                </div>
            )
        })
    }

    selectChangeHandler = e => {
        const rightAnswerId = +e.target.value;
        this.setState({
            rightAnswerId
        })
    }

    render() {
        const select = <Select
            label="Выберите правильный ответ"
            value={this.state.rightAnswerId}
            onChange={this.selectChangeHandler}
            options={[
                {text: 1, value: 1},
                {text: 2, value: 2},
                {text: 3, value: 3},
                {text: 4, value: 4},
            ]}
        />

        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>Создание теста</h1>

                    <form onSubmit={this.submitHandler}>

                        {this.renderInputes()}

                        {select}

                        <Button
                            type="primary"
                            onClick={this.addQuestionHandler} 
                            disabled={!this.state.isFormValid}                 
                        >
                            Добавить вопрос
                        </Button>

                        <Button
                            type="success"
                            onClick={this.createQuizHandler}
                            disabled={this.state.quiz.length === 0}                 
                        >
                            Создать тест
                        </Button>
                    </form>
                </div>
            </div>
        )
    }    
}

