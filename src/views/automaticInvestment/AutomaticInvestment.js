import { Table } from "antd"
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import moment from "moment"
import axios from "axios"
// import { Terminal } from "xterm"

import webssh from "./components/webssh"


import { getAutomaticInvestmentList} from "./../../api/automaticInvestment"

import "./AutomaticInvestment.css"
import Webssh from "./components/webssh";

const { Option } = Select

const layout = {
    layout: "inline",
    labelCol: { span: 8 },
    wrapperCol: { span: 15, offset: 0 },
};

const tailLayout = {
    wrapperCol: {
        offset: 24
    },
};


const IFrom = () => {
    const [theResults, setTheResults] = useState("正常")
    const [runningState, setRunningState] = useState("成功")

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onTheResultsChange = (newCurrency) => {
        console.log(1)
        setTheResults(newCurrency)
    }
    const onRunningStateChange = (newCurrency) => {
        console.log(2)
        setRunningState(newCurrency)
    }
    return (
        <Form
            {...layout}
            onFinish={onFinish}
        >
            <Form.Item
                label="脚本编号"
                name="scriptCode"
                rules={[{ message: 'Please input your username!' }]}
            >
                <Input placeholder="请输入脚本编号" />
            </Form.Item>
            <Form.Item
                label="运行结果:"
                name="theResults"
                rules={[{ message: 'Please input your username!' }]}
            >
                <Select
                    defaultValue={theResults}
                    style={{
                        width: 80,
                        margin: '0 20px',
                    }}
                    onChange={onTheResultsChange}
                >
                    <Option value="正常">正常</Option>
                    <Option value="异常">异常</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="运行状态："
                name={runningState}
                rules={[{ message: 'Please input your username!' }]}
            >
                <Select
                    defaultValue={runningState}
                    style={{
                        width: 80,
                        margin: '0 20px',
                    }}
                    onChange={onRunningStateChange}
                >
                    <Option value="成功">成功</Option>
                    <Option value="失败">失败</Option>
                </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    搜索
                </Button>
            </Form.Item>
        </Form>
    )
}



const columns = [
    {
        title: '脚本编号',
        dataIndex: 'scriptCode',
        key: 'scriptCode',
    },
    {
        title: '脚本名称',
        dataIndex: 'scriptName',
        key: 'scriptName',
    },
    {
        title: '运行状态',
        dataIndex: 'runningState',
        key: 'runningState',
    },
    {
        title: '运行结果',
        dataIndex: 'theResults',
        key: 'theResults',
    },
    {
        title: "上次运行时间",
        dataIndex: "lastRunTime",
        key: "lastRunTime"
    },
    {
        dataIndex: "tunButton",
        key: "tunButton"
    },
    {
        dataIndex: "open",
        key: "open"
    }
];

function AutomaticInvestment(props) {
    const [timeDomShow, setTimeDomShow] = useState(false)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        (function getList(){
            getAutomaticInvestmentList().then(res=>{
                const dataSource = res.data.data.map((item,index)=>(
                    {
                        key: index,
                        scriptCode: item.task_id,
                        scriptName: item.script_name,
                        runningState: 
                            item.task_status === "INIT" ? "初始状态" :  
                            item.task_status === "RUNNING" ? "运行中" :
                            item.task_status === "WAITNEXT" ? "重复执行的间歇" :
                            item.task_status === "FINSH" ? "结束" :
                            "没有数据",
                        theResults: 
                            item.task_result === "SUCCESS" ? "成功" :
                            item.task_result === "FAILED" ? "失败" :
                            "没有数据",
                        // lastRunTime: item.last_time,
                        lastRunTime:moment(item.last_time).utcOffset(480).format('LTS'),
                        tunButton: 
                        (<Button onClick={(e) => {
                            e.stopPropagation()
                            axios.get(item.req_url).then(res=>{
                                if(res.data.data !== "SUCCESS") return
                                getList()
                            })
                        }}>运行</Button>),
                        // description: '这是脚本的详情'

                        description: <div>
                            <Webssh  index={index}/>
                        </div>
                        
                    }
                ))
                setDataSource(dataSource)
            })
        })()
    }, []);


    return (
        <div>
            {/* <div className="prevStateShow">
                {
                    timeDomShow
                        ? (
                            <div className="prevStateShow-children">
                                <div>上次运行时间</div>
                                <div>11::43:54</div>
                            </div>
                        )
                        : null
                }
                <div className="prevStateShow-children">
                    <div>上次运行成功</div>
                    <div>1</div>
                </div>
                <div className="prevStateShow-children">
                    <div>上次运行失败</div>
                    <div>1</div>
                </div>
            </div>
            <IFrom /> */}

            <Table
                expandable={{
                    expandRowByClick: true,
                    expandedRowRender: record => {
                        // const term = new Terminal()
                        // term.open(document.getElementById('terminal'+record.scriptName));
                        // console.log(document.getElementById('terminal'+record.scriptName))
                        return record.description
                    } ,
                    rowExpandable: record => record.name !== 'Not Expandable',
                    onExpandedRowsChange: () => {
                        setTimeDomShow(!timeDomShow)
                    }
                }}
                dataSource={dataSource}
                columns={columns} />
        </div>

    )
}

export default AutomaticInvestment