//投资页面api
import request from "./../utils/request"

//获取投资列表
export function getInvestmentList(params){
    return request.get("/investment/list" , params)
}

//获取投资明细
export function getInvestmentDetail(params){
    return request.get("/investment/detail",params)
}