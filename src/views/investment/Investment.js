
import { useState , useEffect } from "react"
import { Collapse , Button , Layout } from 'antd';
import axios from "axios"

import "./investment.css"

import Web3 from "web3"
import vaultApi from "../../contractAPI/vaultApi"
import stragy from "../../contractAPI/stragy"
import RewardPool from "../../contractAPI/RewardPool"
import aabi from "../../contractAPI/stableContract"

const { Header } = Layout;
const { Panel } = Collapse;

function callback(key) {
//   console.log(key);
}

const Investment = () => {
    const [account , setAccount] = useState([])
    const [dataArray , setDataArray] = useState([])
    const [ investmentList, setInvestmentList] = useState([])
    const [ addresses, setAddresses] = useState([])
    const [ owners, setOwners] = useState([])

    let web3 = new Web3(window.ethereum)
    web3.eth.requestAccounts().then(accounts => {
        setAccount(accounts[0])
    })


    useEffect( ()=>{
        axios.get("https://api.converter.finance/getTokenList").then(res=>{
            const data = res.data.data
            setDataArray(data)

            const newData = data.map((item, index)=>{
                (async ()=> {
                    let {vault_address,strategy_address,pool_address,underlying_address} = item;
                    addresses[index] = {
                        vaultContract: await new web3.eth.Contract( vaultApi, vault_address),
                        strategyContract: await new web3.eth.Contract( stragy, strategy_address),
                        poolContract: await new web3.eth.Contract( RewardPool, pool_address),
                        stableCoinContract: await new web3.eth.Contract( aabi, underlying_address),
                    }
                    setAddresses(addresses)
                    owners[index] = {
                        poolOwner: await addresses[index].poolContract.methods.owner().call(),
                        strategyOwner: await addresses[index].strategyContract.methods.owner().call(),
                    }
                    setOwners(owners)
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
                                <td>{ owners[index] ? owners[index].poolOwner : '-'}</td>
                            </tr>
                            <tr>
                                <td>策略owner</td>
                                <td>{owners[index] ? owners[index].strategyOwner : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
            )})
            setInvestmentList(newData)
        })
    }  ,[])


    async function earns() {
        addresses.forEach((item, index)=>{
            item.vaultContract.methods.earn().send({ from: account })
        })
    }
    async function earn(index) {
        addresses[index].vaultContract.methods.earn().send({ from: account })
    }

    async function harvests() {
        addresses.forEach((item, index)=>{
            item.strategyContract.methods.harvest().send({ from: account })
        })
    }
    async function harvest(index) {
        console.log(addresses[index])
        addresses[index].strategyContract.methods.harvest().send({ from: account })
    }

    return(
        <div>
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <div className="header">
                    <span>POOL INFO</span>
                    <div>
                        <span className="headerButton" onClick={()=>{earns()}}> 一键EARN </span>
                        <span className="headerButton" onClick={()=>{harvests()}}> 一键HARVEST </span>
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
                                    <Button onClick={(e)=>{
                                        e.stopPropagation()
                                        earn(index)}
                                        }>EARN</Button>
                                    <Button onClick={(e)=>{
                                        e.stopPropagation()
                                        harvest(index)}
                                        }>HARVEST</Button>
                                    <Button>⬇️</Button>
                                </div>
                            </div>
                        } key="1">
                        <div>{investmentList[index]}</div>
                        </Panel>
                    </Collapse>
                    )
                })
            }
        </div>
    )
}

export default Investment