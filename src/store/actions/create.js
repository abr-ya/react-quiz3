import {CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION} from './actionTypes';
import axios from '../../axios/axios';

export function createQuizQuestion(item) {
    return {
        type: CREATE_QUIZ_QUESTION,
        item
    }
}

export function finishCreateQuiz() {
    return async (dispatch, getState) => {
        const response = await axios.post('quizes.json', getState().create.quiz);
        console.log('Тест сохранен с ключом: ', response.data.name);
        dispatch(resetQuizCreation());
    }
}

export function resetQuizCreation() {
    return {
        type: RESET_QUIZ_CREATION
    }
}