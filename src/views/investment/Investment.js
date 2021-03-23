// 投资页面
import { useState , useEffect } from "react"
import { Collapse , Button , Layout } from 'antd';
import axios from "axios"

import "./investment.css"

import getWeb3 from "./../../web3/web3"
import vaultApi from "../../contractAPI/vaultApi"

// import {
//     getInvestmentList,
//     getInvestmentDetail
// } from "./../../api/investment"

const { Header } = Layout;

const { Panel } = Collapse;

function callback(key) {
//   console.log(key);
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
    const [dataArray , setDataArray] = useState([])
    const [ investmentList, setInvestmentList] = useState([])
    const [ nvestmentDetail , setNvestmentDetail ] = useState()

    useEffect( ()=>{
        axios.get("https://api.converter.finance/getTokenList").then(res=>{
            console.log(res.data.data)
            const data = res.data.data
            setDataArray(data)
            const newData = data.map(item=>{
                
                const fn = (async function(){
                    const obj = await getWeb3()
                    const web3 = obj.web3
                    const owner = await new web3.eth.Contract(vaultApi, item.vault_address )
                    // console.log(owner)
                    let vaultOwner = await owner.methods.owner().call();
                    // console.log(vaultOwner)
                })()

                return (
                    <table>
                        <tbody>
                            <tr>
                                <td>reward pool地址：</td>
                                <td>{item.pool_address}</td>
                            </tr>
                            <tr>
                                <td>策略地址：</td>
                                <td>{item.strategy_address}</td>
                            </tr>
                            <tr>
                                <td>代币地址</td>
                                <td>{item.underlying_address}</td>
                            </tr>
                            <tr>
                                <td>金库地址</td>
                                <td>{item.vault_address}</td>
                            </tr>
                            <tr>
                                <td>金库owner</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>策略opner</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>poolowner：</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
            )})
            setInvestmentList(newData)
        })
    } ,[])

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
            {
                investmentList.map((item,index)=>{
                    return(
                        <Collapse key={index} onChange={callback}>
                        <Panel header={
                            <div className="investment-table-header">
                                <div>
                                    <span className="tokenName">{dataArray[index]["underlying_name"]}</span>
                                    <span >{dataArray[index]["strategy_index"]}</span>
                                </div>
                                <div className="investment-table-header-right">
                                    <Button>EARN</Button>
                                    <Button>HARVEST</Button>
                                    <Button>打开</Button>
                                </div>
                            </div>
                        } key={index}>
                        <p>{investmentList[index]}</p>
                        </Panel>
                    </Collapse>
                    )
                })
            }
            
        </div>
    )
}

export default Investment