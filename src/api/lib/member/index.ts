import {AppAPI, AppObject} from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.MemberAPI => ({
    myToken: () => v2ex.get<AppObject.MemberToken>('/token', undefined, undefined, undefined,),

    myProfile: () => v2ex.get<AppObject.Member>('/system/user/profile', undefined, undefined, undefined,),

    profile: (id: string | number) =>
        v2ex.get<AppObject.Member>(
            `/system/user/profile`,
            undefined,
            undefined,
            undefined,
            undefined
        ),

    token: (loginId: string, password) =>
        v2ex.send<AppObject.MemberToken>(
            `/login`,
            'post',
            undefined,
            undefined,
            {'username': loginId, "password": password}
        ),
    logout: () =>
        v2ex.send<AppObject.MemberToken>(
            `/logout`,
            'post',
            undefined,
            undefined,
        )
})
