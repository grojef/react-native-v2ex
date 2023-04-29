export declare namespace AppAPI {
    export type API_VERSION = undefined

    /**
     * V2ex Version 2.0 Response
     */
    export interface Response<T> {
        success: boolean
        msg: string
        result: T
        code: number
        data: T[]
        rows: T[]
    }

    /**
     * V2ex API Configuration
     */
    export interface APIConfiguration {
        url?: string
        store?: string
        userAgent?: string
        authentication: {
            token?: string
            scope?: string
            expiration?: number
        }
        extend?: { [name: string]: string | undefined }
    }

    export type HttpMethod =
        | 'get'
        | 'GET'
        | 'delete'
        | 'DELETE'
        | 'head'
        | 'HEAD'
        | 'options'
        | 'OPTIONS'
        | 'post'
        | 'POST'
        | 'put'
        | 'PUT'
        | 'patch'
        | 'PATCH'
        | 'purge'
        | 'PURGE'
        | 'link'
        | 'LINK'
        | 'unlink'
        | 'UNLINK'

    /**
     * V2ex Main API
     */
    export class APP {
        constructor(configuration?: APIConfiguration)

        configuration: APIConfiguration
        root_path?: string
        token?: string
        node: NodeAPI
        topic: TopicAPI
        notification: NotificationAPI
        visit: VisitPI
        member: MemberAPI
        dict: DictAPI
        setOptions: (options: APIConfiguration) => void
        init: () => void

        setToken(token?: string): void

        setUserAgent(userAgent?: string): void

        siteInfo: () => Promise<AppObject.SiteInfo>
        siteStat: () => Promise<AppObject.SiteStat>

        post<T>(
            path: string,
            headers?: { [name: string]: string },
            params?: Record<string, string>,
            version?: API_VERSION
        ): Promise<T>

        put<T>(
            path: string,
            headers?: { [name: string]: string },
            params?: Record<string, string>,
            version?: API_VERSION
        ): Promise<T>

        get<T>(
            path: string,
            headers?: { [name: string]: string },
            params?: Record<string, string>,
            data?: any,
            version?: API_VERSION
        ): Promise<T>

        delete<T>(
            path: string,
            headers?: { [name: string]: string },
            params?: Record<string, string>,
            version?: API_VERSION
        ): Promise<T>

        send<T>(
            path: string,
            method: string,
            headers?: { [name: string]: string },
            params?: Record<string, string>,
            data?: any,
            version?: API_VERSION
        ): Promise<T>

        getErrorMessageForResponse(data: any): string
    }

    export interface MemberAPI {
        /**
         * Get my token info
         */
        myToken: () => Promise<AppObject.MemberToken>

        /**
         * Get my profile
         */
        myProfile: () => Promise<AppObject.Member>

        /**
         * Get user profile
         */
        profile: (id: string | number) => Promise<AppObject.Member>

        /**
         * check user token
         */
        token: (loginId: string, password: string, uuid: string, code: string) => Promise<AppObject.MemberToken>

        /**
         * logout
         */
        logout: () => Promise<AppObject.MemberToken>

        /**
         * 验证码
         */
        captcha: () => Promise<AppObject.Captcha>

        /**
         * 修改密码
         */
        updatePwd: (oldPassword: string, newPassword: string) => Promise<void>
    }

    export interface NodeAPI {
        /**
         * Get node info by node name/id
         * @param node id or node name
         * @param version
         */
        get(id: string | number, version: API_VERSION): Promise<AppObject.Node>

        /**
         * Get All nodes by api version 1
         */
        all(): Promise<AppObject.Node[]>
    }

    export interface NotificationAPI {
        /**
         * Get my latest notifications
         */
        list: (page: number) => Promise<AppObject.Notification[]>

        /**
         * get the notification information
         * @param noticeId
         */
        info: (noticeId: number) => Promise<AppObject.Notification>

        /**
         * Remove notification
         */
        remove: (id: string) => Promise<void>
    }

    export interface VisitPI {
        /**
         * Get my latest notifications
         */
        list: (page: number, searcher: string) => Promise<AppObject.VisitInfo[]>

        /**
         * get the notification information
         * @param visitId
         */
        info: (visitId: number) => Promise<AppObject.VisitInfo>

        /**
         * Remove notification
         */
        save(visitInfo?: AppObject.VisitInfo): Promise<void>

        add(visitInfo?: AppObject.VisitInfo): Promise<void>
    }

    export interface TopicAPI {
        /**
         * Get latest topic list by api version 1
         */
        latestTopics: () => Promise<AppObject.Topic[]>

        /**
         * Get hot topic list by api version 1
         */
        hotTopics: () => Promise<AppObject.Topic[]>

        /**
         * Get topic info by topic id use api verson 1
         * @param id : topic id
         * @param version : api version
         */
        topic(id: number): Promise<AppObject.Topic>

        checkPhoneCall(id: number): Promise<AppObject.Topic>

        callStat(): Promise<AppObject.CallStat>

        grab(label: string): Promise<AppObject.Grab>

        call(id: number): Promise<void>

        insertCallLog(id: number, duration: number): Promise<void>

        update(topic?: AppObject.Topic): Promise<void>

        /**
         *  pager note topic list by api version 2
         * @param name : node name
         */
        only(): Promise<AppObject.PageInfo<AppObject.Topic>>

        intent(page: number, batCode?: string, feature?: string): Promise<AppObject.PageInfo<AppObject.Topic>>

        /**
         * 搜索功能
         * @param phone
         */
        search(phone: string): Promise<AppObject.PageInfo<AppObject.Topic>>
    }

    export interface DictAPI {
        /**
         *
         * @param dictType
         */
        dict(dictType: string): Promise<AppObject.DictMeta[]>
    }
}
export declare namespace AppObject {
    export interface SiteInfo {
        title: string
        slogan: string
        description: string
        domain: string
    }

    export interface SiteStat {
        topic_max: number
        member_max: number
    }

    /**
     * Member Token Info
     */
    export interface MemberToken {
        token: string
    }

    export interface Captcha {
        captchaEnabled: boolean
        uuid: string
        img: string
    }

    /**
     * 用户信息
     */

    export interface User {
        dept: Dept
        userId: number
        userName: string
        phonenumber: string
        nickName: string
        userType: string
        email: string
        sex: string
        createTime: any
        url: string
        website: string
        twitter?: string
        psn?: string
        github?: string
        telegram?: string
        btc?: string
        location?: string
        tagline?: string
        bio?: string
        avatar?: string
        avatar_mini?: string
        avatar_normal?: string
        avatar_large?: string
        avatar_xlarge?: string
        avatar_xxlarge?: string
        avatar_xxxlarge?: string
        created: number
        last_modified?: number
        status?: string
    }

    export interface Dept {
        deptName: string
        deptId: number
    }

    /**
     * Member Profile
     */
    export interface Member {
        postGroup: string
        roleGroup: string
        user: User
    }

    export interface Node {
        createBy: string
        createTime: any
        cssClass: string
        default: boolean
        dictCode: number
        dictLabel: string
        dictSort: number
        dictType: string
        dictValue: string
        isDefault: string
        listClass: string
        remark: string
        status: string
    }

    export interface Topic {
        node?: Node
        member?: Member
        last_reply_by: string
        last_touched: number
        title: string
        url: string
        created: number
        deleted: number
        content: string
        content_rendered: string
        last_modified: number
        replies: number
        id: number
        accBatch: number
        batCode: string
        callFlag: any
        callTime: any
        createTime: any
        createBy: string
        feature: string
        intentFlag: string
        nickName: string
        phoneNumber: string
        remark: string
        sex: string
        userId: number
        userName: string
        risk: boolean
    }


    export interface CallStatLog {
        times: number
        duration: number
    }


    export interface CallStat {
        today: CallStatLog
        yesterday: CallStatLog
        week: CallStatLog
    }

    export interface Notification {
        createBy: string
        createTime: any
        noticeTitle: string
        noticeContent: string
        noticeId: number
        noticeType: any
        remark: string
        status: string
        updateBy: string
        updateTime: any
    }

    export interface VisitInfo {
        id: any
        visitor: string
        userId: number
        userName: string
        deptId: number
        address: string
        visitType1: string
        visitType2: number
        visitType3: number
        visitTime: any
        remark: string
        createBy: string
        createTime: any
    }

  export interface DictMeta {
    createBy: string
    createTime: any
    cssClass: string
    default: boolean
    dictCode: number
    dictLabel: string
    dictSort: number
    dictType: string
    dictValue: string
    isDefault: string
    listClass: string
    remark: string
    status: string
    value: string
    label: string
  }

    export interface Dict {
        type: Dict
        label: string
    }

    export interface PageInfo<T> {
        total: number
        rows: [T]
        code: string
        msg: string
    }

    export interface Grab {
        delayTime: number
    }
}
