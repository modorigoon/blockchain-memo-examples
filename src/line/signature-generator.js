/**
 * Line blockchain signature generator
 *
 * reference: https://docs-blockchain.line.biz/api-guide/Authentication
 */
const CryptoJS = require('crypto-js')
const _ = require('lodash')


function requestBodyFlatten(requestBody = {}) {
    const objectBody = _.cloneDeep(requestBody)
    const flatPair = {}
    Object.keys(objectBody).forEach(key => {
        const value = objectBody[key]
        if (Array.isArray(value)) {
            let allSubKeys = []
            value.forEach(elem => {
                allSubKeys = _.union(allSubKeys, Object.keys(elem))
            })
            value.forEach(elem => {
                allSubKeys.forEach(subKey => {
                    const flatKey = `${key}.${subKey}`
                    const flatRawValue = elem[subKey] ? elem[subKey] : ''
                    const prevFlatValue = flatPair[flatKey]
                    flatPair[flatKey] = _.isUndefined(prevFlatValue) ? flatRawValue : `${prevFlatValue},${flatRawValue}`
                })
            })
        } else {
            flatPair[key] = objectBody[key]
        }
    })
    return Object.keys(flatPair).sort().map(key => `${key}=${flatPair[key]}`).join('&');
}


function generateSignature(apiSecret, method, path, timestamp, nonce, parameters = {}, body = {}) {
    let obj = _.assignIn(parameters, body)

    function createSignTarget() {
        let _signTarget = `${nonce}${timestamp}${method}${path}`
        if (obj && _.size(obj) > 0) {
            if (_signTarget.indexOf('?') < 0) {
                _signTarget += '?'
            } else {
                _signTarget += '&'
            }
        }
        return _signTarget
    }

    let signTarget = createSignTarget()
    if (obj && _.size(obj) > 0) {
        signTarget += requestBodyFlatten(parameters)
    }
    let hash = CryptoJS.HmacSHA512(signTarget, apiSecret)

    return CryptoJS.enc.Base64.stringify(hash)
}


function createNonce(length) {
    return Math.round(
        (Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1)
}


module.exports = { generateSignature, createNonce }
