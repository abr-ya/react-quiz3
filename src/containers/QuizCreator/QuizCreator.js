import React, { Component } from 'react';
import classes from './QuizCreator.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Select from '../../components/UI/Select/Select';
import {createControl, validate, validateForm} from '../../form/form';
import {connect} from 'react-redux';
import {createQuizQuestion, finishCreateQuiz} from '../../store/actions/create';

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

class QuizCreator extends Component {
    state = {
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

        // деструктуризация чтобы избежать массивности
        const {question, option1, option2, option3, option4} = this.state.formControls;

        const questionItem = {
            id: this.props.quiz.length + 1,
            question: question.value,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: option1.value, id: option1.id},
                {text: option2.value, id: option2.id},
                {text: option3.value, id: option3.id},
                {text: option4.value, id: option4.id},
            ]
        }

        // записываем вопрос в Redux Store
        this.props.createQuizQuestion(questionItem);

        // локальные изменения оставляем в локальном стейте
        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls(),
        })
    }

    // обработчик создания теста
    // делаем функцию асинхронной
    createQuizHandler = e => {
        e.preventDefault();

        // получившийся тест
        //console.log(this.state.quiz);        

        // ответ получен - обнуляем State
        this.setState({
            quiz: [],
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls(),
        })
        this.props.finishCreateQuiz();
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
                            disabled={this.props.quiz.length === 0}                 
                        >
                            Создать тест
                        </Button>
                    </form>
                </div>
            </div>
        )
    }    
}


function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuizCreator);