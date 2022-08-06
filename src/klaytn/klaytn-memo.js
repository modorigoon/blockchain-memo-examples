/**
 * Klaytn memo transaction example
 *
 * @author modorigoon
 * @since 0.1.0
 */

const KLAYTN_ENV = {
    PROVIDER: 'https://api.baobab.klaytn.net:8651', // Test net
    CREDENTIALS: {
        KEY_STORE: './keystore.json',
        PASSWORD: 'Your klaytn API password'
    },
    DEFAULT_GAS_LIMIT: 45000
}

const fs = require('fs')
const path = require('path')
const Caver = require('caver-js')
const { encrypt, decrypt } = require('../common/message-crypto')
const caver = new Caver(KLAYTN_ENV.PROVIDER)
const keystore = fs.readFileSync(path.join(__dirname, KLAYTN_ENV.CREDENTIALS.KEY_STORE), 'utf8')
const keyring = caver.wallet.keyring.decrypt(keystore, KLAYTN_ENV.CREDENTIALS.PASSWORD)
caver.wallet.add(keyring)


async function write(data) {
    const transaction = new caver.transaction.valueTransferMemo({
        from: keyring.address,
        to: keyring.address,
        value: 0,
        gas: KLAYTN_ENV.DEFAULT_GAS_LIMIT,
        input: caver.utils.utf8ToHex(encrypt(JSON.stringify(data)))
    })
    const signed = await caver.wallet.sign(keyring.address, transaction)
    return await caver.rpc.klay.sendRawTransaction(signed)
}

module.exports.write = write


async function read(txHash) {
    const transaction = await caver.rpc.klay.getTransactionByHash(txHash)
    return (transaction && transaction.hasOwnProperty('input')) ?
        JSON.parse(decrypt(caver.utils.hexToUtf8(transaction.input))) : null
}

module.exports.read = read
