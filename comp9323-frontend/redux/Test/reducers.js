import { combineReducers } from "redux";
import * as constants from "./constants"
import _ from "lodash";

const _msg = {
    time : 0
}

const _testMsg = (state = _msg , action) => {
    let newState = _.cloneDeep(state);

    switch (action.type) {
        case constants.GET_TIME_SUCCESS:
            const _res = action.result;
            if(_res && _res.time){
                newState.time = _res.time;
            }
            return newState;
        default:
            return newState;
    }
}
const editReducer=(preState,action)=>{
    switch (action.type) {
        case constants.EDIT_REQ_DETAIL:
            return action.payLoad;
        default:
            return preState;
    }
}

const reducer = combineReducers({
    _testMsg,
    editReducer
})

export default reducer;