const { ethers, Wallet } = require('ethers');
const fetch = require("node-fetch");
const sleep = ms => new Promise(res => setTimeout(res, ms));

const privatekey = 'PRIVATE_KEY_HERE';

const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
const wallet = new ethers.Wallet(privatekey, provider);
const signer = wallet.connect(provider);

async function call() {
    const recipient = "RECEIVER_ADDRESS";
    const stuck_txhash = 'stuck tx hash'
    const max_round = 10;
    let round_count = 1;

    const gas_resp = await fetch('https://gasstation-testnet.polygon.technology/v2')
    const gas = await gas_resp.json();
    const gasPrice = parseInt((gas.fast.maxFee) * 1e9);
    // const gasPrice = parseInt((2) * 1e9);

    console.log('stuck tx hash: ', stuck_txhash)
    console.log('checking status....')
    const stuck_txreceipt = await provider.getTransactionReceipt(stuck_txhash)
    await sleep(5000)

    if (stuck_txreceipt != null) {
        console.log('tx status is success')
    }

    else if (stuck_txreceipt == null) {

        const stuck_tx = await provider.getTransaction(stuck_txhash);

        if (stuck_tx != null) {
            console.log('tx status is pending');
            tx_call(gasPrice);
        }
        else {
            console.log('unable to locate this TxnHash')
        }
    }

    async function tx_call(_gasPrice) {
        const tx = {
            from: wallet.address,
            to: recipient,
            value: ethers.utils.parseUnits('0.001', 'ether'),
            gasPrice: _gasPrice,
            gasLimit: ethers.utils.hexlify(50000),
            nonce: provider.getTransactionCount(wallet.address, 'latest')
        };

        console.log('tx sent with gas: ', _gasPrice);
        const transaction = await signer.sendTransaction(tx);

        const tx_hash = transaction.hash.toString();
        console.log('tx hash: ', tx_hash)
        console.log('checking status....')
        await sleep(20000)

        const receipt = await provider.getTransactionReceipt(tx_hash)

        if (receipt != null) {
            console.log('tx status is success')
        }

        else if (receipt == null) {
            console.log('tx status is pending');
            const gas_resp = await fetch('https://gasstation-mumbai.matic.today/v2')
            const gas = await gas_resp.json();
            const gasPrice = parseInt((gas.fast.maxFee) * 1e9);
            // const gasPrice = parseInt((1 + round_count) * 1e8);  //only for testing

            if (round_count < max_round) {
                round_count = round_count + 1;
                console.log('round: ', round_count)
                tx_call(gasPrice)
            }

            else {
                console.log('custom time limit reached')
            }
        }
    }
}

call();
