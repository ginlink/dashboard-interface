import { useState, useEffect } from "react"
import { Collapse, Button, Layout } from 'antd';
import { useSelector } from "react-redux"

import "./investment.css"

const { Header } = Layout;
const { Panel } = Collapse;

function callback(key) {
    //   console.log(key);
}



const Investment = () => {


    const [investmentList, setInvestmentList] = useState([])

    const account = useSelector(state => state.get("account"))
    const addresses = useSelector(state => state.get("addresses"))
    const owners = useSelector(state => state.get("owners"))
    const dataArray = useSelector(state => state.get("dataArray"))

    useEffect(() => {
        let newData = dataArray.map((item, index) => {
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
                            <td>{owners[index] ? owners[index].poolOwner : '-'}</td>
                        </tr>
                        <tr>
                            <td>策略owner</td>
                            <td>{owners[index] ? owners[index].strategyOwner : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            )
        })

        setInvestmentList(newData)
    }, [dataArray, owners]);

    async function earns() {
        addresses.forEach((item, index) => {
            item.vaultContract.methods.earn().send({ from: account })
        })
    }
    async function earn(ev, index) {
        ev.cancelBubble = true
        ev.stopPropagation()
        addresses[index].vaultContract.methods.earn().send({ from: account })
    }

    async function harvests() {
        addresses.forEach((item, index) => {
            item.strategyContract.methods.harvest().send({ from: account })
        })
    }
    async function harvest(ev, index) {
        ev.cancelBubble = true
        ev.stopPropagation()
        addresses[index].strategyContract.methods.harvest().send({ from: account })
    }

    return (
        <div>
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <div className="header">
                    <span>POOL INFO</span>
                    <div className="header_right">
                        <Button onClick={() => { earns() }}> 一键EARN </Button>
                        <Button onClick={() => { harvests() }}> 一键HARVEST </Button>
                        {
                            account === "" ?
                                ""
                                :
                                <div className="account-name">
                                    <span className="">{account.substr(0, 4)}</span>
                                    <span>...</span>
                                    <span>{account.substr(-4, 4)}</span>
                                </div>

                        }


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
                investmentList.map((item, index) => {
                    return (
                        <Collapse key={index} onChange={callback}>
                            <Panel header={
                                <div className="investment-table-header">
                                    <div>
                                        <span className="tokenName">{dataArray[index]["underlying_name"]}</span>
                                        <span >{dataArray[index]["strategy_index"]}</span>
                                    </div>
                                    <div className="investment-table-header-right">
                                        <Button onClick={(ev) => { earn(ev, index) }}>EARN</Button>
                                        <Button onClick={(ev) => { harvest(ev, index) }}>HARVEST</Button>
                                        <Button>⬇</Button>
                                    </div>
                                </div>
                            } key="1">
                                <div>{item}</div>
                            </Panel>
                        </Collapse>
                    )
                })
            }
        </div>
    )
}

export default Investment