//封装请求

import axios from "axios"

const request = axios.create({
    baseURL:"https://localhost:3001"
})

export default axios