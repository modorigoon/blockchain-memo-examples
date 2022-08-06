/**
 * GroundX klaytn memo transaction example
 *
 * @author modorigoon
 * @since 0.1.0
 */

const _ = require('lodash')
const klaytnMemo = require('./klaytn-memo')


describe('GroundX klaytn memo transaction tests.', () => {

    const TEST_DATA = {name: 'Jone', age: 19}
    let testTransactionHash = null


    it('Write memo transaction test.', async () => {
        const response = await klaytnMemo.write(TEST_DATA)
        expect(_.get(response, 'transactionHash')).not.toBe(undefined)
        testTransactionHash = _.get(response, 'transactionHash')
    })

    it('Read memo transaction test.', async () => {
        const response = await klaytnMemo.read(testTransactionHash)
        expect(_.get(response, 'name')).toBe(TEST_DATA.name)
        expect(_.get(response, 'age')).toBe(TEST_DATA.age)
    })
})
