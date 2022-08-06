/**
 * Luniverse trace program tests
 *
 * @author modorigoon
 * @since 0.1.0
 */

const _ = require('lodash')
const { LuniverseTraceExample } = require('./trace')


describe('Luniverse trace tests.', () => {

    const TEST_OBJECT_ID = `TEST-${new Date().getTime()}`
    const TEST_EVENT = { region: 'SU', account: 'Jane' }


    it('Add event.', async () => {

        const trace = new LuniverseTraceExample()
        await trace.authorize()

        const eventName = 'CREATE'

        const result = await trace
            .addEvent(TEST_OBJECT_ID, trace.timestamp(), TEST_EVENT.region, eventName, TEST_EVENT)

        expect(_.get(result, 'objectId')).toBe(TEST_OBJECT_ID)
        expect(_.get(result, 'userName')).toBe(TEST_EVENT.region)
        expect(_.get(result, 'eventName')).toBe(eventName)

        const data = JSON.parse(_.get(result, 'data'))

        expect(_.get(data, 'region')).toBe(TEST_EVENT.region)
        expect(_.get(data, 'account')).toBe(TEST_EVENT.account)

        await trace
            .addEvent(TEST_OBJECT_ID, trace.timestamp(), TEST_EVENT.region, 'READ', TEST_EVENT)
    })

    it('Get events.', async () => {

        const trace = new LuniverseTraceExample()
        await trace.authorize()

        let results = await trace.getEvents(TEST_OBJECT_ID, null, TEST_EVENT.region, null, 1)

        expect(_.size(results)).toBe(2)
        let result = results[0]

        expect(_.get(result, 'objectId')).toBe(TEST_OBJECT_ID)
        expect(_.get(result, 'userName')).toBe(TEST_EVENT.region)

        const data = JSON.parse(_.get(result, 'data'))
        expect(_.get(data, 'region')).toBe(TEST_EVENT.region)
        expect(_.get(data, 'account')).toBe(TEST_EVENT.account)

        results = await trace.getEvents(TEST_OBJECT_ID, 'CREATE', TEST_EVENT.region, null, 1)
        expect(_.size(results)).toBe(1)
        result = results[0]
        expect(_.get(result, 'eventName')).toBe('CREATE')
    })

    it('Get event.', async () => {

        const trace = new LuniverseTraceExample()
        await trace.authorize()

        const updated = await trace
            .addEvent(TEST_OBJECT_ID, trace.timestamp(), TEST_EVENT.region, 'READ', TEST_EVENT)

        const response = await trace.getEvent(_.get(updated, 'eventId'))
        expect(_.get(response, 'objectId')).toBe(TEST_OBJECT_ID)
        expect(_.get(response, 'userName')).toBe(TEST_EVENT.region)
    })
})
