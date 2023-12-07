const { ethers } = require('ethers');

const providerUrl = 'https://bsc.publicnode.com';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const privateKey = 'Private Key 私钥';  //修改这里
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = '0xd45f35D17F67FdFd9f73a9cd248A16a8A38f683C'; 

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
    for (let i = 0; i < 1000; i++) {    // 循环次数
        try {
            let j = i % 20;
            if(j == 0) {
                nonce = await getCurrentNonce(wallet);
                currentGasPrice = await provider.getGasPrice();
            }
            const tx = await wallet.sendTransaction({
                to: contractAddress,
                value: ethers.utils.parseEther("0.002"), 
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