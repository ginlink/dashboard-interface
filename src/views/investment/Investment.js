import { useState, useEffect, useRef, Fragment } from "react";
import { Collapse, Button, Layout, Input, Spin } from "antd";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";

import "./investment.css";

const { Header } = Layout;
const { Panel } = Collapse;

function callback(key) {
  //   console.log(key);
}
const Investment = () => {
  const inputRef = useRef();
  const [investmentList, setInvestmentList] = useState([]);

  const account = useSelector((state) => {
    return state.get("account");
  });
  const addresses = useSelector((state) => state.get("addresses"));
  const owners = useSelector((state) => {
    return state.get("owners");
  });
  const dataArray = useSelector((state) => state.get("dataArray"));
  const investmentListOnLoad = useSelector((state) =>
    state.get("investmentListOnLoad")
  );

  useEffect(() => {
    // console.log(addresses)
    async function transferAuthorityHandler(name, index,functionName) {
      if(!investmentListOnLoad)return alert("请等待数据加载完成，稍后重试") 
      const value = inputRef.current.input.value;
      // addresses[index][name].methods.setOperator(value).send({ from: account });
      addresses[index][name].methods[functionName](value).send({ from: account });
    }
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
              <td>{owners && owners[index] ? owners[index].poolOwner : "-"}</td>
              <Button
                  type="primary"
                  shape="round"
                  onClick={() => {
                    transferAuthorityHandler("vaultContract", index,"transferOwnership");
                  }}
                >
                  权限转移
                </Button>
            </tr>
            <tr>
              <td>策略owner</td>
              <td>
                {owners && owners[index] ? owners[index].strategyOwner : "-"}
              </td>
              <Button
                  type="primary"
                  shape="round"
                  onClick={() => {
                    transferAuthorityHandler("strategyContract", index,"transferOwnership");
                  }}
                >
                  权限转移
                </Button>
            </tr>

            <tr>
              <td>策略operator</td>
              <td>
                {owners && owners[index] ? owners[index].stragyOperator : "-"}
              </td>
              <td>
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => {
                    transferAuthorityHandler("strategyContract", index,"setOperator");
                  }}
                >
                  权限转移
                </Button>
              </td>
            </tr>
            <tr>
              <td>金库operator</td>
              <td>
                {owners && owners[index] ? owners[index].vaultOperator : "-"}
              </td>
              <td>
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => {
                    transferAuthorityHandler("vaultContract", index,"setOperator");
                  }}
                >
                  权限转移
                </Button>
              </td>
            </tr>
            <tr>
              <td>pool operator</td>
              <td>
                {owners && owners[index] ? owners[index].poolOperator : "-"}
              </td>
              <td>
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => {
                    transferAuthorityHandler("poolContract", index,"setOperator");
                  }}
                >
                  权限转移
                </Button>
              </td>
            </tr>
            <tr>
              <td>pool feeManager</td>
              <td>
                {owners && owners[index] ? owners[index].poolFeeManager : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      );
    });
    setInvestmentList(newData);
  }, [owners, dataArray, account, addresses,investmentListOnLoad]);

  async function earns() {
    addresses.forEach((item, index) => {
      console.log(index);
      item.vaultContract.methods.earn().send({ from: account });
    });
  }
  async function earn(ev, index) {
    ev.cancelBubble = true;
    ev.stopPropagation();
    if (!addresses[index]) return alert("数据加载中，请稍后重试");
    addresses[index].vaultContract.methods.earn().send({ from: account });
  }

  async function harvests() {
    addresses.forEach((item, index) => {
      item.strategyContract.methods.harvest().send({ from: account });
    });
  }
  async function harvest(ev, index) {
    ev.cancelBubble = true;
    ev.stopPropagation();
    if (!addresses[index]) return alert("数据加载中，请稍后重试");
    addresses[index].strategyContract.methods.harvest().send({ from: account });
  }

  function calculateDiffTime(start_time) {
		if(!parseInt(start_time)) return "-";
		var endTime = Math.round(new Date() / 1000);

		var timeDiff = endTime - start_time
		var day = parseInt(timeDiff / 86400);
		var hour = parseInt((timeDiff % 86400) / 3600);
		var minute = parseInt((timeDiff % 3600) / 60);

		day = day?(day+'天'):'';
		hour = hour?(hour+"时"):'';
		minute = minute?(minute+"分"):'';
		return day + hour + minute;
	}

  return (
    <div>
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <div className="header">
          <div>POOL INFO</div>
          <div className="header_right">
            <div>
              <Input placeholder="请输入你的权限地址" ref={inputRef} />
            </div>
            {investmentListOnLoad ? (
              <Fragment>
                <Button
                  onClick={() => {
                    earns();
                  }}
                >
                  {" "}
                  一键EARN{" "}
                </Button>
                <Button
                  onClick={() => {
                    harvests();
                  }}
                >
                  {" "}
                  一键HARVEST{" "}
                </Button>
              </Fragment>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {"EARN HARVEST 加载中 "}
                <Spin size="middle" />
              </div>
            )}
            {account === "" || account === undefined ? null : (
              <div className="account-name">
                <span className="">{String(account).substr(0, 4)}</span>
                <span>...</span>
                <span>{String(account).substr(-4, 4)}</span>
              </div>
            )}
          </div>
        </div>
      </Header>
      <Panel
        style={{
          paddingLeft: "20px",
          paddingTop: "10px",
          height: "40px",
          textAlign: "40px",
          fontWeight: 600,
        }}
        header={
          <div className="investment-table-header">
            <div className="investment-content-wrap">
              <span className="tokenName">名称</span>
              <span className="tokenName">收益代币</span>
              <span className="tokenName">pool总资产</span>
              <span className="tokenName">已投总资产</span>
              <span className="tokenName">最后一次复投时间</span>
            </div>
            <div></div>
          </div>
        }
        key="1"
      ></Panel>
      {investmentList.map((item, index) => {
        return (
          <Collapse key={index} onChange={callback}>
            <Panel
              header={
                <div className="investment-table-header">
                  <div className="investment-content-wrap">
                    <span className="tokenName">
                      {dataArray[index]["underlying_name"]}
                    </span>
                    <span className="tokenName">
                      {dataArray[index]["strategy_index"]}
                    </span>
                    <span className="tokenName">
                      {owners &&
                      owners[index] &&
                      owners[index]["poolTotalSupply"]
                        ? new BigNumber(owners[index]["poolTotalSupply"])
                            .div(new BigNumber(10).pow(18))
                            .toFixed(6)
                        : "-"}
                    </span>
                    <span className="tokenName">
                      {owners &&
                      owners[index] &&
                      owners[index]["totalInvestedAssets"] &&
                      owners[index]["poolTotalSupply"]
                        ? new BigNumber(
                            owners[index]["poolTotalSupply"] -
                              owners[index]["totalInvestedAssets"]
                          )
                            .div(new BigNumber(10).pow(18))
                            .toFixed(6)
                        : "-"}
                    </span>
                    <span className="tokenName">
                      {owners &&
                      owners[index] &&
                      owners[index]["recentlyAfterVotingTime"]
                        // ? moment((new Date().getTime() - owners[index]["recentlyAfterVotingTime"]) * 1000).utcOffset(480).format('LTS')
                        ? calculateDiffTime(owners[index]["recentlyAfterVotingTime"])+"钟前"
                        : "-"}
                    </span>
                  </div>
                  <div className="investment-table-header-right">
                    <Button
                      onClick={(ev) => {
                        earn(ev, index);
                      }}
                    >
                      EARN
                    </Button>
                    <Button
                      onClick={(ev) => {
                        harvest(ev, index);
                      }}
                    >
                      HARVEST
                    </Button>
                    <Button>⬇</Button>
                  </div>
                </div>
              }
              key="1"
            >
              <div>{item}</div>
            </Panel>
          </Collapse>
        );
      })}
    </div>
  );
};

export default Investment;
