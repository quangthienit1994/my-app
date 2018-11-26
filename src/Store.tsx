import { combineReducers, createStore } from 'redux';

import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
const defaultTheme = {
    palette: {
        primary: indigo,
        secondary: pink,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
        type: "light",
        background: {
            paper: "#fff",
            default: "#f2f2f2"
        }
    },
    typography: {
        useNextVariants: true,
        fontSize: 16,
        fontFamily: "'Oswald', sans-serif"
    }
}

export default () => {

    const reducers = combineReducers({
        NOTIFICATIONS: (state = [], action: any) => {
            switch (action.type) {
                case 'ADD_NOTIFICATION':
                case 'NOTIFICATION':
                    return [...state, { uid: new Date().getTime(), ...action.data }];
                case 'REMOVE_NOTIFICATION':
                    return state.filter(({ uid }: any) => uid !== action.uid);
                default: return state;
            }
        },
        PROFILE: (state = {}, action: any) => {
            switch (action.type) {
                case 'UPDATE_PROFILE':
                    return { ...state, ...action.data };
                default:
                    return state;
            }
        },
        THEME: (state = defaultTheme, action: any) => {
            switch (action.type) {
                case 'UPDATE_THEME':
                    const type = state.palette.type === 'light' ? 'dark' : 'light';
                    return {
                        ...state,
                        palette: {
                            ...state.palette,
                            type,
                            background: type === "dark" ? {
                                paper: "#232323",
                                default: "#000"
                            } : {
                                    paper: "#fff",
                                    default: "#f2f2f2"
                                }
                        }
                    };
                default:
                    return state;
            }
        }
    });

    const store = createStore(reducers, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

    return store;
}
