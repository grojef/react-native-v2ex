import _ from 'lodash'
import {AppAPI, AppObject} from './types'
import member from './lib/member'
import node from './lib/node'
import dict from './lib/dict'
import notification from './lib/notification'
import topic from './lib/topic'
import reply from './lib/reply'
import visit from './lib/visit'
import {NavigationService} from '@src/navigation'

import {logError} from '../helper/logger'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MEMBER_TOKEN_KEY} from "@config/constants";

/**
 * default configuration
 */
const defaultConfiguration = {
    url: 'http://43.136.117.70:8080',
    store: 'api',
    userAgent: 'V2EX API Library',
    authentication: {
        token: undefined,
        scope: undefined,
        expiration: undefined
    }
}

class V2ex {
    configuration: AppAPI.APIConfiguration = defaultConfiguration
    root_path?: string
    token?: string
    reply: AppAPI.ReplyAPI = reply(this)
    member: AppAPI.MemberAPI = member(this)
    dict: AppAPI.DictAPI = dict(this)
    visit: AppAPI.VisitPI = visit(this)
    node: AppAPI.NodeAPI = node(this)
    topic: AppAPI.TopicAPI = topic(this)
    notification: AppAPI.NotificationAPI = notification(this)

    constructor(options?: AppAPI.APIConfiguration) {
        if (options) {
            this.setOptions(options)
        }
        this.init()
    }

    setOptions(options: AppAPI.APIConfiguration) {
        this.configuration = _.merge(this.configuration, options)
        this.root_path = `/${this.configuration.store}`

        this.member = member(this)
        this.node = node(this)
        this.notification = notification(this)
        this.topic = topic(this)

        logError(JSON.stringify(options))
    }

    init() {
        if (this.configuration.authentication.token) {
            this.token = this.configuration.authentication.token
            return
        }
    }

    setToken(token?: string) {
        this.token = token || this.configuration.authentication.token
    }

    setUserAgent(userAgent?: string) {
        this.configuration.userAgent = userAgent || this.configuration.userAgent
    }

    siteInfo() {
        return this.get<AppObject.SiteInfo>('/site/info.json', undefined, undefined, undefined)
    }

    siteStat() {
        return this.get<AppObject.SiteStat>('/site/stats.json', undefined, undefined, undefined)
    }

    post<T>(
        path: string,
        headers?: { [name: string]: string },
        params?: Record<string, string>,
        version?: AppAPI.API_VERSION
    ): Promise<T> {
        return this.send<T>(path, 'POST', headers, undefined, params, version)
    }

    put<T>(
        path: string,
        headers?: { [name: string]: string },
        params?: Record<string, string>,
        version?: AppAPI.API_VERSION
    ): Promise<T> {
        return this.send<T>(path, 'PUT', headers, undefined, params, version)
    }

    get<T>(
        path: string,
        headers?: { [name: string]: string },
        params?: Record<string, string>,
        data?: any,
        version?: AppAPI.API_VERSION
    ): Promise<T> {
        return this.send<T>(path, 'GET', headers, params, data, version)
    }

    delete<T>(
        path: string,
        headers?: { [name: string]: string },
        params?: Record<string, string>,
        version?: AppAPI.API_VERSION
    ): Promise<T> {
        return this.send<T>(path, 'DELETE', headers, params, undefined, version)
    }

    send<T>(
        path: string,
        method: AppAPI.HttpMethod,
        headers?: { [name: string]: string },
        params?: Record<string, string>,
        data?: any,
        version?: AppAPI.API_VERSION
    ): Promise<T> {
        let uri = `${this.configuration.url}${path}`

        if (params) {
            let separator = '?'
            Object.keys(params).forEach((key) => {
                uri += `${separator}${key}=${params[key]}`
                separator = '&'
            })
        }
        let _headers: { [name: string]: string } = {
            'User-Agent': this.configuration.userAgent || 'Starter App Api Library',
            'Content-Type': 'application/json'
        }

        if (this.token) {
            _headers.Authorization = `Bearer ${this.token}`
        }

        headers = _.merge(_headers, headers)
        return new Promise<T>((resolve, reject) => {
            console.log(uri)
            fetch(uri, {method, headers, body: JSON.stringify(data)})
                .then((response: Response) => {

                    if (response.ok) {
                        return response.json()
                    }
                    if ([404].includes(response.status)) {
                        return reject(new Error('No http resource found.'))
                    }
                    return response.json().then((errorResponse) => {
                        reject(errorResponse)
                    })
                })
                .then((responseData) => {
                    if (responseData) {
                        if (responseData.code == 401) {
                            AsyncStorage.setItem(MEMBER_TOKEN_KEY, '')
                            ApiLib.setToken(undefined)
                            NavigationService.navigate("SignIn")
                            return
                        }
                        if (responseData.code == 500) {
                            const res = responseData as AppAPI.Response<T>
                            reject(res)
                        }
                        if (responseData.rows) {
                            resolve(responseData.rows)
                        } else {
                            resolve(responseData.data)
                        }
                    }
                })
                .catch((error) => {
                    logError(error)
                    const customError = this.getErrorMessageForResponse(error)
                    reject(new Error(customError))
                })
        })
    }

    getErrorMessageForResponse(_data: any) {
        const params = _data.parameters
        let {message} = _data
        if (typeof params !== 'undefined') {
            if (Array.isArray(params) && params.length > 0) {
                _data.parameters.forEach((item: string, index: number) => {
                    message = message.replace(`%${index + 1}`, item)
                })
                return message
            }
            _.forEach(params, (value, name) => {
                message = message.replace(`%${name}`, value)
            })
        }
        return message
    }
}

const ApiLib: AppAPI.APP = new V2ex()

export {ApiLib}
