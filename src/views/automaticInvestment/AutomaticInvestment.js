
// 自动化投资页面
import { Table } from "antd"
import React , { useState , useEffect } from 'react';
import { Form, Row, Col, Input, Button,Select } from 'antd';

import "./AutomaticInvestment.css"

import {
    getAutomaticInvestmentList ,
    getAutomaticInvestmentScript
} from "./../../api/automaticInvestment"

const { Option } = Select

const layout = {
    layout:"inline",
    labelCol: { span: 8 },
    wrapperCol: { span: 15 , offset:0 },
  };

const tailLayout = {
    wrapperCol: {
        offset: 24
    },
};


const IFrom = () => {
    const [ theResults , setTheResults ] = useState( "正常" )
    const [ runningState , setRunningState ] = useState( "成功" )

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
    return(
        <Form
        {...layout}
        onFinish={onFinish}
        >
            <Form.Item
            label="脚本编号"
            name="scriptCode"
            rules={[{ message: 'Please input your username!' }]}
            >
                <Input placeholder="请输入脚本编号"/>
            </Form.Item>
            <Form.Item
            label="运行结果:"
            name="theResults"
            rules={[{ message: 'Please input your username!' }]}
            >
                {/* <Input /> */}
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
                defaultValue="成功"
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

function AutomaticInvestment() {
    const [ timeDomShow , setTimeDomShow ] = useState(false)
    const [ dataSource , setDataSource] = useState([])

    useEffect(() => {
        setDataSource ([
            {
                key: '1',
                scriptCode: '胡彦斌',
                scriptName: 32,
                runningState: '西湖区湖底公园1号',
                theResults: "成功",
                lastRunTime: "11-0-1",
                tunButton: (<button onClick={(e)=>{
                    e.stopPropagation()
                }}>运行</button>),
                open: (<button>打开</button>),
                description: '这是脚本的详情'
            },
            {
                key: '2',
                scriptCode: '胡彦祖',
                scriptName: 42,
                runningState: '西湖区湖底公园1号',
                theResults: "成功",
                lastRunTime: "11-0-1",
                tunButton: (<button onClick={(e)=>{
                    e.stopPropagation()
                }}>打开</button>),
                open: (<button>运行</button>)
            },
        ]);
    }, [dataSource]);
    return (
        <div>
            <div className="prevStateShow">
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
            <IFrom />

            <Table
                expandable={{
                    expandRowByClick: true,
                    expandedRowRender: record => (
                        <div>{record.description}</div>
                    ),
                    rowExpandable: record => record.name !== 'Not Expandable',
                    onExpandedRowsChange:()=>{
                        setTimeDomShow(!timeDomShow)
                    }
                }}
                dataSource={dataSource}
                columns={columns} />
        </div>

    )
}

export default AutomaticInvestment