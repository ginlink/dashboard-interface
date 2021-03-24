import { Map } from "immutable";
import * as types from "./actionTypes"

const reducer = ( state = Map({
    web3:{},
    account:"",
    dataArray:[],
    addresses:[],
    owners:[]
}) , action) =>{
    switch(action.type){
        case  types.CHANGEWEB3 :
            return state.set("web3",action.payload)
        case types.CHANGEACCOUNT:
            return state.set("account",action.payload)
        case types.CHANGEDATARRAY:
            return state.set("dataArray",action.payload)
        case types.CHANGEADDRESSES:
            return state.set("addresses",action.payload)
        case types.CHANGEOWNERS:
            return state.set("owners",action.payload)
        default:
            return state
    }
}
export default reducer