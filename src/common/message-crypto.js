/**
 * Message encrypt/decrypt module
 *
 * @author modorigoon
 * @since 0.1.0
 */

const crypto = require('crypto')

const OPTIONS = {
    ALGORITHM: 'aes-256-cbc',
    KEY: 'modorigoon@3!'.repeat(2),
    LENGTH: 16
}


function encrypt(message) {
    const iv = crypto.randomBytes(OPTIONS.LENGTH)
    const cipher = crypto.createCipheriv(OPTIONS.ALGORITHM, Buffer.from(OPTIONS.KEY), iv)
    const encrypted = cipher.update(message)
    return `${iv.toString('hex')}:${Buffer.concat([encrypted, cipher.final()]).toString('hex')}`
}

module.exports.encrypt = encrypt


function decrypt(enc) {
    const textParts = enc.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(OPTIONS.ALGORITHM, Buffer.from(OPTIONS.KEY), iv)
    const decrypted = decipher.update(encryptedText)
    return Buffer.concat([decrypted, decipher.final()]).toString()
}

module.exports.decrypt = decrypt
