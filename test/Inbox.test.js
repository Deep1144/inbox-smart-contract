const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require('../compile');

let accounts;
let inbox;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    const from = accounts[0]
    try {
        inbox = await new web3.eth.Contract(abi)
            .deploy({
                data: bytecode.object,
                arguments: ['Hi there']
            })
            .send({
                from: from, gas: 1500000,
            })

    } catch (error) {
        console.log('error', error)
    }
})

describe('Inbox', () => {
    it('should have address', () => {
        assert.ok(accounts.length >= 1) 
        assert.ok(inbox.options.address)
    })

    it('should have default message', async () => {
        const message = await inbox.methods.message().call()
        assert.equal('Hi there', message)
    })

    it('should update the message', async () => {
        const tnx = await inbox.methods.changeMessage('some random').send({
            from: accounts[1]
        })
        console.log('tnx', tnx)
        const message = await inbox.methods.message().call()
        assert.ok(tnx.transactionHash)
        assert.equal('some random', message)
    })
})