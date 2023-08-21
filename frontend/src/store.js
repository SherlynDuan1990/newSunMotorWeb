import { legacy_createStore as createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension"


import { carReducers, carDetailsReducers, testDriveReducer} from "./reducers/carReducers"
import {contactUsReducers} from "./reducers/contactUsReducers"

const reducer=combineReducers({
    cars: carReducers,
    carDetails: carDetailsReducers,
    testDrive: testDriveReducer,
    contactUs: contactUsReducers
})
let initialState ={}

const middleware=[thunk]


const store=createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;