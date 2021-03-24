import { Suspense, useEffect } from "react"
import { HashRouter as Router } from "react-router-dom"
import Web3 from "web3"
import { connect } from "react-redux"
import axios from "axios"

import Index from "./layout/main"
import store from "./store"
import * as types from "./store/investment/actionTypes"

import vaultApi from "./contractAPI/vaultApi"
import stragy from "./contractAPI/stragy"
import RewardPool from "./contractAPI/RewardPool"
import aabi from "./contractAPI/stableContract"

function App({ dispatch }) {




  const addresses = store.getState().get("addresses")
  const owners = store.getState().get("owners")



  useEffect(() => {
    let web3 = new Web3(window.ethereum)
    web3.eth.requestAccounts().then(accounts => {
      dispatch({
        type: types.CHANGEACCOUNT,
        payload: accounts[0]
      })
    })

    async function getAddressesAndOwners(data) {
      for (let index in data) {
        let item = data[index]
        let { vault_address, strategy_address, pool_address, underlying_address } = item;
        addresses[index] = {
          vaultContract: await new web3.eth.Contract(vaultApi, vault_address),
          strategyContract: await new web3.eth.Contract(stragy, strategy_address),
          poolContract: await new web3.eth.Contract(RewardPool, pool_address),
          stableCoinContract: await new web3.eth.Contract(aabi, underlying_address),
        }
        owners[index] = {
          poolOwner: await addresses[index].poolContract.methods.owner().call(),
          strategyOwner: await addresses[index].strategyContract.methods.owner().call(),

          vaultOperator: await addresses[index].vaultContract.methods.operator().call(), //金库操作员
          stragyOperator: await addresses[index].strategyContract.methods.operator().call(),//策略操作员
          poolOperator: await addresses[index].poolContract.methods.operator().call(),//pool操作员

          // vaultFeeManager: await addresses[index].vaultContract.methods.feeManager().call(),//金库手续费账号
          // stragyFeeManager: await addresses[index].strategyContract.methods.feeManager().call(),//策略手续费账号
          poolFeeManager: await addresses[index].poolContract.methods.feeManager().call(),//pool手续费账号
        }
        dispatch({
          type: types.CHANGEADDRESSES,
          payload: addresses
        })
        dispatch({
          type: types.CHANGEOWNERS,
          payload: [...owners]
        })
      }
    }
    (async () => {
      let res = await axios.get("https://api.converter.finance/getTokenList")
      const data = res.data.data
      dispatch({
        type: types.CHANGEDATARRAY,
        payload: data
      })
      await getAddressesAndOwners(data)
      console.log(1)
    })()
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
