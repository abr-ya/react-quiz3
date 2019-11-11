import React from 'react';
import cn from 'classnames';

import classes from './AnswersItem.module.css';


// компонент ...
const AnswersItem = props => {

    return (
        <li
            className={cn(
                classes.AnswersItem,
                {
                    [classes.AnswersItemError]: (props.state === 'error'),
                    [classes.AnswersItemSuccess]: (props.state === 'success'),
                }
            )}
            onClick={() => props.onAnswerClick(props.answer.id)}
        >
            {props.answer.text}
        </li>
    ) 
}

export default AnswersItem;
