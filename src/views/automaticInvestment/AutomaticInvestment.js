
import { Table } from "antd"
import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';

import "./AutomaticInvestment.css"





const From = () => {
    const getFields = () => {
        const fromList = ["脚本编号","运行结果","运行状态"]
        const children = [];

        for (let i = 0; i < fromList.length; i++) {
            children.push(
            <Col span={5} key={i}>
                <Form.Item
                name={fromList[i]}
                label={fromList[i]}
                >
                <Input placeholder="placeholder" />
                </Form.Item>
            </Col>,
            );
        }
        children.push(
        <Col
        span={8}
        style={{
            textAlign: 'right',
        }}
        >
        <Button type="primary" htmlType="submit">
            Search
        </Button>
        </Col>)
        return children;
    };

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const [form] = Form.useForm();
    return (
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
        >
            <Row gutter={20}>{getFields()}</Row>
        </Form>
    )
}


const dataSource = [
    {
        key: '1',
        scriptCode: '胡彦斌',
        scriptName: 32,
        runningState: '西湖区湖底公园1号',
        theResults: "成功",
        lastRunTime: "11-0-1",
        tunButton: (<button>运行</button>),
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
        tunButton: (<button>运行</button>),
        open: (<button>打开</button>)
    },
];

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
    return (
        <div>
            <div className="prevStateShow">
                <div className="prevStateShow-children">
                    <div>上次运行成功</div>
                    <div>1</div>
                </div>
                <div className="prevStateShow-children">
                    <div>上次运行失败</div>
                    <div>1</div>
                </div>
            </div>
            <From />

            <Table
                expandable={{
                    expandRowByClick: true,
                    expandedRowRender: record => (
                        <div>{record.description}</div>
                    ),
                    rowExpandable: record => record.name !== 'Not Expandable',
                }}
                dataSource={dataSource}
                columns={columns} />
        </div>

    )
}

export default AutomaticInvestment