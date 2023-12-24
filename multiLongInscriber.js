const { ethers } = require('ethers');

const providerUrl = 'https://opbnb-mainnet-rpc.bnbchain.org';    //RPC节点
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const privateKey = 'Private Key 私钥';  //修改这里
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = '0x658c3941eae10398da5456951cdaf795984d106b';     //LongInscriber Contract


function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function getCurrentNonce(wallet) {
    try {
      const nonce = await wallet.getTransactionCount("pending");
      console.log("Nonce:", nonce);
      return nonce;
    } catch (error) {
      console.error("Error fetching nonce:", error.message);
      throw error;
    }
}

async function sendData() {
    let nonce = 0;
    let currentGasPrice = 0;
    let amount = 10000;  // 循环次数
    for (let i = 0; i < amount; i++) {    
        try {
            let j = i % 20;
            if(j == 0) {
                nonce = await getCurrentNonce(wallet);
                currentGasPrice = await provider.getGasPrice();
            }
            const tx = await wallet.sendTransaction({
                to: contractAddress,
                value: ethers.utils.parseEther("0.00025"), 
                gasPrice: currentGasPrice,
                nonce: nonce + j
            });
            console.log(`第 ${i + 1} 次数据交易哈希:`, tx.hash);
        } catch (error) {
            i--;
            console.error('发生异常:', error.message);
        }
    }
}

sendData();
