//封装请求

import axios from "axios"

const request = axios.create({
    baseURL:"http://192.168.3.80:9800"
})

export default request