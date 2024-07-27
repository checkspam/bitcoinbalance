const axios = require('axios').default;
const { ethers } = require("ethers");
axios.defaults.timeout = 20000;
const fs = require('fs/promises');


async function getNativebalance(mnemonic, decimals){
    let address = getAddress(mnemonic)
        let response = await axios.post('http://127.0.0.1:8545', {    "jsonrpc": "2.0",    "method": "eth_getBalance",    "id": 1734,    "params": [address, "latest"]})
        return hexTodec(response.data.result, decimals)
    }
    



async function getTokenbalance(mnemonic, contract, decimals){
    let address = getAddress(mnemonic)
    let response = await axios.post('http://127.0.0.1:8545', {"jsonrpc":"2.0","method":"eth_call","id":432,"params":[{"to":contract,"data":"0x70a08231000000000000000000000000" + address.slice(2)},"latest"]})
    return hexTodec(response.data.result, decimals)
}


function hexTodec(hex, decimals){
    if (parseInt(hex, 16) == 0) return 0;
    else 
    return (parseInt(hex, 16) / (10** decimals)).toFixed(6)
}


function getAddress(mnemonic){
    try{
        const address = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath("m/44'/60'/0'/0/0").address
        console.log(address)
        fs.writeFile("", address + '\r\n').then(x=> {
            return address
        })
        
    }
    catch(e){
        console.log(e)
        return
    }
}


module.exports = {
    getNativebalance,
    getTokenbalance
}