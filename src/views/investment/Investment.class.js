
import React from "react"
import { Collapse, Button, Layout } from 'antd';
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

export default class Investment extends React.Component {

    state = {
        account: [],
        dataArray:[],
        investmentList: [],
        addresses: [],
        owners: []
    }

    componentDidMount() {
        let web3 = new Web3(window.ethereum)
        web3.eth.requestAccounts().then(accounts => {
            this.setState({ account: accounts[0] })
        })

        axios.get("https://api.converter.finance/getTokenList").then(res => {
            const data = res.data.data
            this.setState({
                dataArray:data
            })

            const newData = data.map((item, index) => {
                (async () => {
                    let { vault_address, strategy_address, pool_address, underlying_address } = item;
                    this.state.addresses[index] = {
                        vaultContract: await new web3.eth.Contract(vaultApi, vault_address),
                        strategyContract: await new web3.eth.Contract(stragy, strategy_address),
                        poolContract: await new web3.eth.Contract(RewardPool, pool_address),
                        stableCoinContract: await new web3.eth.Contract(aabi, underlying_address),
                    }
                    this.setState({
                        addresses:this.state.addresses
                    })
                    this.state.owners[index] = {
                        poolOwner: await this.state.addresses[index].poolContract.methods.owner().call(),
                        strategyOwner: await this.state.addresses[index].strategyContract.methods.owner().call(),
                    }
                    this.setState({
                        owners:this.state.owner
                    })
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
                                <td>{this.state.owners[index] ? this.state.owners[index].poolOwner : '-'}</td>
                            </tr>
                            <tr>
                                <td>策略owner</td>
                                <td>{this.state.owners[index] ? this.state.owners[index].strategyOwner : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                )
            })
            this.setState({
                investmentList:newData
            })
        })
    }

    earns() {
        (async function(){
            this.state.addresses.forEach((item, index)=>{
                item.vaultContract.methods.earn().send({ from: this.state.account })
            })
        })()
    }
    earn(index) {
        (async function(){
            this.state.addresses[index].vaultContract.methods.earn().send({ from: this.state.account })
        })()
    }

    harvests() {
        (async function(){
            this.state.addresses.forEach((item, index)=>{
                item.strategyContract.methods.harvest().send({ from: this.state.account })
            })
        })()
    }
    harvest(index) {
        (async function(){
            this.state.console.log(this.state.addresses[index])
            this.state.addresses[index].strategyContract.methods.harvest().send({ from: this.state.account })
        })()
    }

    render(){
        return(
            <div>
                <Header className="site-layout-background" style={{ padding: 0 }} >
                    <div className="header">
                        <span>POOL INFO</span>
                        <div>
                            <span className="headerButton" onClick={()=>{this.state.earns()}}> 一键EARN </span>
                            <span className="headerButton" onClick={()=>{this.state.harvests()}}> 一键HARVEST </span>
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
                    this.state.investmentList.map((item,index)=>{
                        return(
                            <Collapse key={index} onChange={callback}>
                            <Panel header={
                                <div className="investment-table-header">
                                    <div>
                                        <span className="tokenName">{this.state.dataArray[index]["underlying_name"]}</span>
                                        <span >{this.state.dataArray[index]["strategy_index"]}</span>
                                    </div>
                                    <div className="investment-table-header-right">
                                        <Button onClick={(e)=>{
                                            e.stopPropagation()
                                            this.state.earn(index)}
                                            }>EARN</Button>
                                        <Button onClick={(e)=>{
                                            e.stopPropagation()
                                            this.state.harvest(index)}
                                            }>HARVEST</Button>
                                        <Button>⬇️</Button>
                                    </div>
                                </div>
                            } key="1">
                            <div>{this.state.investmentList[index]}</div>
                            </Panel>
                        </Collapse>
                        )
                    })
                }
            </div>
        )
    }

    
}
