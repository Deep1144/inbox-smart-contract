const HdWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const RECOVERY_PHARSE = process.env.RECOVERY_PHARSE;
// URL of infura 
const PROVIDER_URL = process.env.PROVIDER_URL;
if (!PROVIDER_URL || !RECOVERY_PHARSE) {
    throw new Error('RECOVERY_PHARSE and PROVIDER_URL are required')
}

const provider = new HdWalletProvider(
    RECOVERY_PHARSE,
    PROVIDER_URL
);
const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    let inbox;
    console.log('Attempting to deploy..', accounts[0])
    try {
        inbox = await new web3.eth.Contract(abi)
            .deploy({
                data: bytecode.object,
                arguments: ['Hi there']
            })
            .send({
                from: accounts[0], gas: 1000000,
            })
        console.log(inbox)
        console.log('deployed to:', inbox.options.address)
        // 0xD93094d4a63621ECA57AD41F3B3b00CA8E37170D
    } catch (error) {
        console.log('error', error)
    }
}

deploy()