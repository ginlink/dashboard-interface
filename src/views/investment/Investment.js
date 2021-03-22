// 投资页面
import { useState , useEffect } from "react"
import { Collapse , Button , Layout } from 'antd';

import "./investment.css"

import {
    getInvestmentList,
    getInvestmentDetail
} from "./../../api/investment"

const { Header } = Layout;

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = (
    <table>
        <tbody>
            <tr>
                <td>reward pool地址：</td>
                <td></td>
            </tr>
            <tr>
                <td>策略地址：</td>
                <td></td>
            </tr>
            <tr>
                <td>代币地址</td>
                <td></td>
            </tr>
            <tr>
                <td>金库地址</td>
                <td></td>
            </tr>
            <tr>
                <td>金库owner</td>
                <td></td>
            </tr>
            <tr>
                <td>策略opwner</td>
                <td></td>
            </tr>
        </tbody>
    </table>
)

const Investment = () => {
    const [ investmentList, setInvestmentList] = useState([])
    const [ nvestmentDetail , setNvestmentDetail ] = useState()

    useEffect( ()=>{
        getInvestmentList().then(res=>{
            console.log(res)
        })
    } )

    return(
        <div>
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <div className="header">
                    <span>POOL INFO</span>
                    <div>
                        <span className="headerButton" > 一键EARN </span>
                        <span className="headerButton"> 一键HARVEST </span>
                    </div>
                </div>
            </Header>
            <div className="investment-header">
                <div className="investment-header-wrap">
                    <span className="investment-header-left">名称</span>
                    <span className="investment-header-right">收益代币</span>
                </div>
            </div>
            <Collapse defaultActiveKey={['1']} onChange={callback}>
                <Panel header={
                    <div className="investment-table-header">
                        <div>
                            <span className="tokenName">MDX-USTD</span>
                            <span >con</span>
                        </div>
                        <div className="investment-table-header-right">
                            <Button>EARN</Button>
                            <Button>HARVEST</Button>
                            <button>⬇️</button>
                        </div>
                    </div>
                } key="1">
                <p>{text}</p>
                </Panel>
            </Collapse>
        </div>
    )
}

export default Investment