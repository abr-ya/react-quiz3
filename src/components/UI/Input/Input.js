import React from 'react';
import classes from './Input.module.css';

// валидация
function isInvalid({valid, touched, shouldValidate}) {
    return !valid && shouldValidate && touched; // если инпут: невалидный, должен валидироваться, мы с ним работали
}

const Input = props => {
    const inputType = props.type || 'text';
    const cls = [classes.Input];
    const htmlFor = `${inputType}-${Math.random()}`;

    if (isInvalid(props)) {
        cls.push(classes.Invalid);
    }

    return (
        <div className={cls.join(' ')}>
            <label htmlFor={htmlFor}>{props.label}</label>
            <input
                type={inputType}
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
            />
            {
                isInvalid(props)
                    ? <span className={classes.Error}>{props.errorMessage || 'Ошибка. Нет сообщения об ошибке.'}</span>
                    : null
            }
        </div>
    )
}

export default Input;
