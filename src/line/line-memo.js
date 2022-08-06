/**
 * Line blockchain memo transaction example
 *
 * @author modorigoon
 * @since 0.1.0
 */

const LINE_BLOCKCHAIN_ENV = {
    NONCE_LENGTH: 8,
    API: {
        BASE_URL: 'https://test-api.blockchain.line.me',
        KEY: 'Your Line blockchain API key',
        SECRET: 'Your Line blockchain API secret'
    },
    WALLET: {
        ADDRESS: 'Your Line blockchain wallet address',
        SECRET: 'Your Line blockchain wallet secret'
    }
}

const _ = require('lodash')
const { generateSignature, createNonce } = require('./signature-generator')
const { encrypt, decrypt } = require('../common/message-crypto')
const Axios = require('axios')
const axios = Axios.create({
    baseURL: LINE_BLOCKCHAIN_ENV.API.BASE_URL,
    timeout: 3000
})


function requestHeader() {
    return {
        'service-api-key': LINE_BLOCKCHAIN_ENV.API.KEY,
        'nonce': createNonce(LINE_BLOCKCHAIN_ENV.NONCE_LENGTH),
        'timestamp': new Date().getTime().toString(),
        'Content-Type': 'application/json'
    }
}


async function write(data) {
    const path = '/v1/memos'
    const header = requestHeader()
    const encryptedData = encrypt(JSON.stringify(data))
    const body = {
        'walletAddress': LINE_BLOCKCHAIN_ENV.WALLET.ADDRESS,
        'walletSecret': LINE_BLOCKCHAIN_ENV.WALLET.SECRET,
        'memo': encryptedData
    }
    header['signature'] = generateSignature(
        LINE_BLOCKCHAIN_ENV.API.SECRET,
        'POST',
        path,
        header.timestamp,
        header.nonce,
        {},
        body
    )
    const response = await axios({ method: 'POST', url: path, data: body, headers: header })

    return _.get(response, 'data.responseData.txHash')
}

module.exports.write = write


async function read(txHash) {
    const path = `/v1/memos/${txHash}`
    const header = requestHeader()
    header['signature'] = generateSignature(
        LINE_BLOCKCHAIN_ENV.API.SECRET,
        'GET',
        path,
        header.timestamp,
        header.nonce,
        {},
        {}
    )
    const response = await axios({ method: 'GET', url: path, headers: header})
    return JSON.parse(decrypt(_.get(response, 'data.responseData.memo')))
}

module.exports.read = read;
