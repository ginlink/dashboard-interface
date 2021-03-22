//自动化投资页面api
import request from "./../utils/request"

// 获取自动化投资列表
export function getAutomaticInvestmentList (params) {
    return request.get("/automaticInvestment/list" , params)
}

// 获取自动化投资脚本详情
export function getAutomaticInvestmentScript (params) {
    return request.get("/automaticInvestment/list" , params)
}

//获取筛选的数据
export function getFilterData (params) {
    return request.get("/automaticInvestment/filterData")
}