/**
 * Line blockchain tests
 *
 * @author modorigoon
 * @since 0.1.0
 */

const _ = require('lodash')
const lineMemo = require('./line-memo')

const JEST_TIMEOUT = 10000
jest.setTimeout(JEST_TIMEOUT)
const sleep = seconds => new Promise(res => setTimeout(() => res(), JEST_TIMEOUT / 2))

describe('Line memo transaction tests.', () => {

    const TEST_DATA = {name: 'Jone', age: 19}
    let transactionHashId = null

    it('Write transaction.', async () => {
        transactionHashId = await lineMemo.write(TEST_DATA)
        expect(transactionHashId).not.toBe(undefined)
        expect(typeof transactionHashId).toBe('string')
    })

    it('Read transaction.', async () => {
        await sleep(5) // Waiting for blockchain transaction processing.
        const response = await lineMemo.read(transactionHashId)
        expect(_.get(response, 'name')).toBe(TEST_DATA.name)
        expect(_.get(response, 'age')).toBe(TEST_DATA.age)
    })
})
