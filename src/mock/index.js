import Mock from "mockjs"
Mock.setup({
    timeout: 400
})
export default Mock.mock("http://192.168.3.80:9800/getTaskList" , "get" , 
{
    data:[
        {
            "task_id｜1-5":"*",
            script_name:"*",
            runningState:"*",
            theResults:"*",
            lastRunTime:"*",
            req_url:"*",
        },
        {
            "task_id｜1-5":"*",
            script_name:"*",
            runningState:"*",
            theResults:"*",
            lastRunTime:"*",
            req_url:"*",
        },
        {
            "task_id｜1-5":"*",
            script_name:"*",
            runningState:"*",
            theResults:"*",
            lastRunTime:"*",
            req_url:"*",
        }
    ]
}
)