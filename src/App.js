import { Suspense, useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import Web3 from "web3";
import { connect } from "react-redux";
import axios from "axios";

// import "./mock/index"

import Index from "./layout/main";
import store from "./store";
import * as types from "./store/investment/actionTypes";

import vaultApi from "./contractAPI/vaultApi";
import stragy from "./contractAPI/stragy";
import RewardPool from "./contractAPI/RewardPool";
import aabi from "./contractAPI/stableContract";

function App({ dispatch }) {
  const addresses = store.getState().get("addresses");
  const owners = store.getState().get("owners");

  useEffect(() => {
    let web3 = new Web3(window.ethereum);
    web3.eth.requestAccounts().then((accounts) => {
      dispatch({
        type: types.CHANGEACCOUNT,
        payload: accounts[0],
      });
    }, []);

    function getRecentlyAfterVotingTime(arg, blockInfo) {
      let timeStamp = "20分钟内没有复投"
      if (!arg || !arg["_jsonInterface"]) return timeStamp
      arg["_jsonInterface"].forEach(item => {
        if (item.signature === blockInfo.data.result[0].input) {
          timeStamp = blockInfo.data.result[0].timeStamp
        }
      })
      return timeStamp
    }

    async function getAddressesAndOwners(data) {
      const blockInfo = await axios.get(`https://api.hecoinfo.com/api?module=account&action=txlist&address=0x2f8570c0a21fdf2774e1a63bb9f568dcf323f38d&startblock=${web3.eth.getBlockNumber() - 600}&endblock=${web3.eth.getBlockNumber()}&sort=desc&apikey=25MQ3HCDZ6J12KFH4W83JYIWVQBNCBYBSF`)
      for (let index in data) {
        let item = data[index];
        let {
          vault_address,
          strategy_address,
          pool_address,
          underlying_address,
        } = item;
        addresses[index] = {
          vaultContract: await new web3.eth.Contract(vaultApi, vault_address),
          strategyContract: await new web3.eth.Contract(
            stragy,
            strategy_address
          ),
          poolContract: await new web3.eth.Contract(RewardPool, pool_address),
          stableCoinContract: await new web3.eth.Contract(
            aabi,
            underlying_address
          ),
        };
        // debugger
        owners[index] = {
          poolOwner: await addresses[index].poolContract.methods.owner().call(),
          strategyOwner: await addresses[index].strategyContract.methods
            .owner()
            .call(),
          vaultOwner:await addresses[index].vaultContract.methods.owner().call(),

          vaultOperator: await addresses[index].vaultContract.methods
            .operator()
            .call(), //金库操作员
          stragyOperator: await addresses[index].strategyContract.methods
            .operator()
            .call(), //策略操作员
          poolOperator: await addresses[index].poolContract.methods
            .operator()
            .call(), //pool操作员

          // vaultFeeManager: await addresses[index].vaultContract.methods.feeManager().call(),//金库手续费账号
          // stragyFeeManager: await addresses[index].strategyContract.methods.feeManager().call(),//策略手续费账号
          poolFeeManager: await addresses[index].poolContract.methods
            .feeManager()
            .call(), //pool手续费账号

          poolTotalSupply: await addresses[index].vaultContract.methods
            .balance()
            .call(),
          //已投总资产

          totalInvestedAssets: await addresses[index].stableCoinContract.methods
            .balanceOf(vault_address)
            .call(),
          //已投总资产

          recentlyAfterVotingTime: getRecentlyAfterVotingTime(addresses[index].strategyContract, blockInfo) //最后一次复投时间
        };
        dispatch({
          type: types.CHANGEADDRESSES,
          payload: addresses,
        });
        dispatch({
          type: types.CHANGEOWNERS,
          payload: [...owners],
        });
        if (Number(index) === data.length - 1) {
          console.log("CHAGNEINVESTMENTLISTONLOAD");
          dispatch({ type: types.CHAGNEINVESTMENTLISTONLOAD, payload: true });
        }
      }
      console.log(addresses)


    }
    (async () => {
      let res = await axios.get("https://api.converter.finance/getTokenList");
      const data = res.data.data;
      dispatch({
        type: types.CHANGEDATARRAY,
        payload: data,
      });

      // data.push({
      //   vault_address:"0xE0ecc9d2C608b3a0c9caEDb217160d72a619F26e",
      //   strategy_address:"0xCbB85cf8A6F95AcEBBbad182C41C28966Ec34457",
      //   pool_address:"0x6CCE11F6ecb4B8Ce23714146f057CfB714a1c25b",
      // })
      // dispatch({
      //   type: types.CHANGEDATARRAY,
      //   payload: data,
      // });
      

      await getAddressesAndOwners(data);

      


    })();
  }, [addresses, owners, dispatch]);

  return (
    <div className="App">
      <Suspense fallback={<div>加载中</div>}>
        <Router>
          <Index />
        </Router>
      </Suspense>
    </div>
  );
}

export default connect()(App);
