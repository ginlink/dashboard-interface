// import { createContext } from "react"
import Web3 from 'web3'

import vaultabi from "../contractAPI/vaultApi"
import stragy from "../contractAPI/stragy"
import RewardPool from "../contractAPI/RewardPool"
import aabi from "../contractAPI/stableContract"

let web3 = new Web3(window.ethereum)

let context = {
    account: '',
    getContract: async (el)=>{
        let {vault_address,strategy_address,pool_address,underlying_address} = el;
        let names ='addr'+ vault_address;
        return {
            globleWeb3: web3,
            vaultContract: await new web3.eth.Contract( vaultabi, vault_address),
            stragyContract: await new web3.eth.Contract( stragy, strategy_address),
            poolContract: await new web3.eth.Contract( RewardPool, pool_address),
            stableCoinContract: await new web3.eth.Contract( aabi, underlying_address),
        }
    }
}
web3.eth.requestAccounts().then(accpunts => {
    context.account = accpunts[0]
})
export default context