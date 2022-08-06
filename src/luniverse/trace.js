/**
 * Luniverse trace example
 *
 * @author modorigoon
 * @since 0.1.0
 */

const LUNIVERSE_ENV = {
    BASE_URL: 'https://api.luniverse.io/svc/v2',
    KEY: 'Your luniverse API key',
    SECRET: 'Your luniverse API secret token',
    PROGRAM_ID: 'Luniverse trace program ID'
}

const _ = require('lodash')
const moment = require('moment')
const Axios = require('axios')

class LuniverseTraceExample {

    /**
     * Initialize axios HTTP request client
     */
    constructor() {
        this.axios = Axios.create({
            baseURL: LUNIVERSE_ENV.BASE_URL,
            timeout: 3000
        })
    }

    async authorize () {
        const authResponse = await this.axios.post('/auth-tokens', {
            accessKey: LUNIVERSE_ENV.KEY,
            secretKey: LUNIVERSE_ENV.SECRET,
            expiresIn: moment(new Date()).add(30, 'minutes').unix()
        })
        const token = _.get(authResponse, 'data.data.authToken.token')
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    async addEvent(objectId, timestamp, userName, eventName, data) {
        return _.get(await this.axios({
            method: 'POST',
            url: `/neptune/trace-programs/${LUNIVERSE_ENV.PROGRAM_ID}/events`,
            data: {
                objectId: objectId,
                timestamp: timestamp,
                userName: userName,
                eventName: eventName,
                data: JSON.stringify(data)
            }
        }), 'data.data.event')
    }

    async getEvents(objectId, eventName, userName, dates, page) {
        const params = []
        if (objectId) params.push(`objectId=${objectId}`)
        if (eventName) params.push(`eventName=${eventName}`)
        if (userName) params.push(`userName=${userName}`)
        if (_.get(dates, 'start') && _.get(dates, 'end')) {
            params.push(`fromDate=${dates.start}`, `toDate=${dates.end}`)
        }
        if (page) params.push(`page=${page}`)
        let requestParams = ''
        if (_.size(params) > 0) {
            requestParams = params.join('&')
        }
        const path = `/neptune/trace-programs/${LUNIVERSE_ENV.PROGRAM_ID}/events?${requestParams}`
        const response = await this.axios({ method: 'GET', url: path })
        return _.get(response,'data.data.events.items')
    }

    async getEvent(eventId) {
        return _.get(await this.axios({
            method: 'GET',
            url: `/neptune/trace-programs/${LUNIVERSE_ENV.PROGRAM_ID}/events/${eventId}`
        }), 'data.data.event')
    }

    timestamp () {
        return Math.round(new Date().getTime() / 1000)
    }
}

module.exports = { LuniverseTraceExample }
