import { RouterState, connectRouter, routerMiddleware, CallHistoryMethodAction } from 'connected-react-router';
import { createBrowserHistory } from "history";
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk, {ThunkDispatch as OldThunkDispatch} from "redux-thunk"
import { IAuthState } from './auth/state';
import { authReducer } from './auth/reducers';
import { IAuthActions } from './auth/actions';
import { ILoadingState } from './loading/state';
import { ILocationState, ISettingState, IMarkerState, IToStoreRoomState, IToPlaceState } from './location/states';
import { loadReducer } from './loading/reducer';
import { locationReducer, settingReducer, markerReducer, toStoreRoomReducer, placeReducer } from './location/reducers';
import { ILoadingActions } from './loading/action';
import { ILocationActions, ISettingActions, IMarkerActions } from './location/actions';
import { IRoomState } from './roomInfo/states';
import { roomInfoReducer } from './roomInfo/reducers';
import { IRoomActions } from './roomInfo/actions';
import { ITimeSlotState } from './bookTimeSlot/states';
import { timeSlotReducer } from './bookTimeSlot/reducers';
import { ITimeSlotActions } from './bookTimeSlot/actions';
import { IWeeklyTimeSlotActions } from './createRoom/actions';
import { IWeeklyTimeSlotState } from './createRoom/state';
import { weeklyTimeSlotReducer } from './createRoom/reducers';

export const history = createBrowserHistory();

export interface IRootState{
    router: RouterState
    auth:IAuthState
    isLoading: ILoadingState
    iP: ILocationState
	setting: ISettingState
    userInfo: IAuthState
    room: IRoomState
    selected: IMarkerState
    chosenRoom: IToStoreRoomState
    place: IToPlaceState
    timeSlot: ITimeSlotState
    createWeeklyTimeSlot: IWeeklyTimeSlotState
}

const rootReducer = combineReducers<IRootState>({
    router: connectRouter(history),
    auth: authReducer,
    isLoading: loadReducer,
    iP: locationReducer,
	setting: settingReducer,
    userInfo: authReducer,
    room: roomInfoReducer,
    selected: markerReducer,
    chosenRoom: toStoreRoomReducer,
    place: placeReducer,
    timeSlot: timeSlotReducer,
    createWeeklyTimeSlot: weeklyTimeSlotReducer
});


declare global{
    /* tslint:disable:interface-name */
    interface Window{
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__:any
    }
}


type  IRootAction = CallHistoryMethodAction | IAuthActions | ILoadingActions | ILocationActions | ISettingActions | IRoomActions | IMarkerActions | ITimeSlotActions | IWeeklyTimeSlotActions
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type ThunkDispatch = OldThunkDispatch<IRootState, null, IRootAction>


export default createStore<IRootState,IRootAction,{},{}>(
    rootReducer,
    composeEnhancers(
        applyMiddleware(routerMiddleware(history)),
        applyMiddleware(thunk))
    )