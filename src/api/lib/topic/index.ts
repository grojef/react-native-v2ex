import {AppAPI, AppObject} from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.TopicAPI => ({

    call: (id) => {
        return v2ex.get<void>(`/cms/claimInfo/updateCallById/${id}`, undefined, undefined)
    },
    /**
     * pager note topic list by api version 2
     * @param name : node name
     */
    pager: (name) =>
        v2ex.get<AppObject.Topic[]>(`/cms/claimInfo/only`, undefined, undefined, undefined,),

    update: (topic: AppObject.Topic) => {
        return v2ex.send<void>('/cms/claimInfo', 'PUT', undefined, undefined, topic)
    },

    intent: (page: number, batCode: string, feature: string) =>
        v2ex.get<AppObject.Topic[]>(`/cms/claimInfo/intent?batCode=${batCode}&feature=${feature}&pageNum=${page}&pageSize=100`, undefined, {}, undefined,),

    grab: (label) => {
        return v2ex.send<AppObject.Grab>(`/cms/claimInfo/grab`, 'post', undefined, undefined, {'batCode': label})
    },
    /**
     * get node topic by api version 1
     * @param name : node name
     */
    topics: (name: number | string = 'python', get_type: 'username' | 'node_id' | 'node_name' | 'id') =>
        v2ex.get<AppObject.Topic[]>(`/topics/show.json?${get_type}=${name}`, undefined, undefined, undefined, undefined),

    /**
     * Get latest topic list by api version 1
     */
    latestTopics: () => v2ex.get<AppObject.Topic[]>('/cms/claimInfo/only', undefined, undefined, undefined, undefined),
    /**
     * Get hot topic list by api version 1
     */
    hotTopics: () => v2ex.get<AppObject.Topic[]>('/cms/claimInfo/only', undefined, undefined, undefined, undefined),

    /**
     * Get topic info by topic id
     * @param id : topic id
     */
    topic: (id: number) => v2ex.get<AppObject.Topic>(`/cms/claimInfo/${id}`, undefined, undefined, undefined,)
})
