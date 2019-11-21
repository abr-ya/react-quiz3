import React, { Component } from 'react';
import classes from './Auth.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import is from 'is_js';
import {connect} from 'react-redux';
import {auth} from '../../store/actions/auth';


class Auth extends Component {
    state = {
        isFormValid: false,
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный адрес',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите корректный пароль',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    }

    // авторизация
    loginHandler = () => {
        this.props.auth(
            this.state.formControls.email.value,
            this.state.formControls.password.value,
            true
        )
    }

    // регистрация
    registerHandler = () => {
        this.props.auth(
            this.state.formControls.email.value,
            this.state.formControls.password.value,
            false
        )        
    }

    submitHandler = e => {
        e.preventDefault();
    }

    // проверка валидации
    validateControl(value, validation) {
        if (!validation) {
            return true;
        }

        // создаем переменную и начинаем проверять
        let isValid = true;

        if (validation.required) {
            isValid = value.trim() !== '' && isValid; // значение не пустое
        }

        if (validation.email) {
            isValid = is.email(value) && isValid; // используем функцию из библиотеки
        }

        if (validation.minLength) {
            isValid = value.length >= validation.minLength && isValid; // проверяем длину
        }

        return isValid;
    }

    onChangeHandler = (event, controlName) => {
        const formControls = {...this.state.formControls}; // чтобы не мутировать State
        const control = {...formControls[controlName]}

        control.value = event.target.value;
        control.touched = true; // трогали
        control.valid = this.validateControl(control.value, control.validation);

        formControls[controlName] = control;

        // валидация всей формы
        let isFormValid = true;
        // проверяем, что ВСЕ поля валидные
        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid;
        })

        this.setState({
            formControls,
            isFormValid
        })
    }

    renderInputs() {
        // зачем мы мапим ключи? потому, что это объект а не массив?
        const inputs = Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName];
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />              
            )
        })
        return inputs;
    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={this.submitHandler} className={classes.AuthForm}>

                        {this.renderInputs()}

                        <Button
                            type='success'
                            onClick={this.loginHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Войти
                        </Button>

                        <Button
                            type='primary'
                            onClick={this.registerHandler}
                        >
                            Регистрация
                        </Button>
                    </form>
                </div>
            </div>
        )
    }    
}


function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth)
