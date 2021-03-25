//自动化投资页面api
import request from "./../utils/request"

// 获取自动化投资列表
export function getAutomaticInvestmentList (params) {
    return request.get("/getTaskList" , params)
}

