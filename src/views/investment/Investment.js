// 投资页面
import { useState , useEffect } from "react"
import { Collapse , Button , Layout } from 'antd';
import axios from "axios"

import "./investment.css"

import Web3 from "web3"
import vaultApi from "../../contractAPI/vaultApi"
import stragy from "../../contractAPI/stragy"
import RewardPool from "../../contractAPI/RewardPool"
import aabi from "../../contractAPI/stableContract"
import vaultabi from "../../contractAPI/vaultApi";
import web3 from "../../web3/web3";

const { Header } = Layout;
const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const Investment = () => {
    const [dataArray , setDataArray] = useState([])
    const [ investmentList, setInvestmentList] = useState([])
    const [ addresses, setAddresses] = useState({})

    let web3 = new Web3(window.ethereum)


    useEffect( ()=>{
        axios.get("https://api.converter.finance/getTokenList").then(res=>{
            // console.log(res.data.data)
            const data = res.data.data
            setDataArray(data)

            const newData = data.map(item=>{
                (async ()=> {
                    let {vault_address,strategy_address,pool_address,underlying_address} = item;
                    let names = 'addr' + item.vault_address;
                    addresses[names] = {
                        vaultContract: await new web3.eth.Contract( vaultApi, vault_address),
                        stragyContract: await new web3.eth.Contract( stragy, strategy_address),
                        poolContract: await new web3.eth.Contract( RewardPool, pool_address),
                        stableCoinContract: await new web3.eth.Contract( aabi, underlying_address),
                    }
                    setAddresses(addresses)
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
                                <td>策略owner</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
            )})
            setInvestmentList(newData)
        })


    } ,[] )

    async function earns() {
        let account = (await web3.eth.requestAccounts())[0];
        for (let addr in addresses) {
            addresses[addr].vaultContract.methods.earn().send({ from: account })
        }
    }

    return(
        <div>
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <div className="header">
                    <span>POOL INFO</span>
                    <div>
                        <span className="headerButton" onClick={()=>{earns()}}> 一键EARN </span>
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
                        <Collapse key={index} defaultActiveKey={['1']} onChange={callback}>
                        <Panel header={
                            <div className="investment-table-header">
                                <div>
                                    <span className="tokenName">{dataArray[index]["underlying_name"]}</span>
                                    <span >{dataArray[index]["strategy_index"]}</span>
                                </div>
                                <div className="investment-table-header-right">
                                    <Button>EARN</Button>
                                    <Button>HARVEST</Button>
                                    <button>⬇️</button>
                                </div>
                            </div>
                        } key="1">
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