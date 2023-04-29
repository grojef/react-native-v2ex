import {AppAPI, AppObject} from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.TopicAPI => ({
    call: (id) => {
        return v2ex.get<void>(`/cms/claimInfo/updateCallById/${id}`)
    },
    /**
     * pager note topic list by api version 2
     * @param name : node name
     */
    only: () => v2ex.get<AppObject.PageInfo<AppObject.Topic>>(`/cms/claimInfo/only`),

    update: (topic: AppObject.Topic) => {
        return v2ex.send<void>('/cms/claimInfo', 'PUT', undefined, undefined, topic)
    },

    insertCallLog(id: number, duration: number): Promise<void> {
        return v2ex.send<void>(`/cms/claimInfo/insertCallLog`, 'post', undefined, undefined, {id: id, duration: duration})
    },

    intent: (page: number, batCode: string, feature: string) =>
        v2ex.get<AppObject.PageInfo<AppObject.Topic>>(
            `/cms/claimInfo/intent?batCode=${batCode}&feature=${feature}&pageNum=${page}&pageSize=20`,
            undefined,
            {},
            undefined
        ),
    search: (phone: string) => {
        return v2ex.send<AppObject.PageInfo<AppObject.Topic>>(`/cms/claimInfo/search`, 'post', undefined, undefined, {phone: phone})
    },

    grab: (label) => {
        return v2ex.send<AppObject.Grab>(`/cms/claimInfo/grab`, 'post', undefined, undefined, {batCode: label})
    },
    /**
     * Get latest topic list by api version 1
     */
    latestTopics: () => v2ex.get<AppObject.Topic[]>('/cms/claimInfo/only'),
    /**
     * Get hot topic list by api version 1
     */
    hotTopics: () => v2ex.get<AppObject.Topic[]>('/cms/claimInfo/only'),

    /**
     * Get topic info by topic id
     * @param id : topic id
     */
    topic: (id: number) => v2ex.get<AppObject.Topic>(`/cms/claimInfo/${id}`),

    /**
     * check phone risk
     * @param id
     */
    checkPhoneCall: (id: number) =>
        v2ex.get<AppObject.Topic>(`/cms/claimInfo/checkPhoneCall/${id}`,),

    callStat: () =>
        v2ex.get<AppObject.CallStat>(`/cms/callLog/stat`),
})
