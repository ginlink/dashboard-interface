import Web3 from "web3"



async function getWeb3 () {
    if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
    }
    const accounts = await web3.eth.requestAccounts() 
    const account = accounts[0]
    
    return {
        web3,
        account
    }
}

export default getWeb3