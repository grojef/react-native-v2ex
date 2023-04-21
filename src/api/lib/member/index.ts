import {AppAPI, AppObject} from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.MemberAPI => ({
  myToken: () => v2ex.get<AppObject.MemberToken>('/token'),

  myProfile: () => v2ex.get<AppObject.Member>('/system/user/profile'),

  profile: (id: string | number) => v2ex.get<AppObject.Member>(`/system/user/profile`),

  token: (loginId: string, password, uuid: string, code: string) =>
    v2ex.send<AppObject.MemberToken>(`/login`, 'post', undefined, undefined, {
      username: loginId,
      password: password,
      uuid: uuid,
      code: code
    }),
  logout: () => v2ex.send<AppObject.MemberToken>(`/logout`, 'post'),
  captcha: () => v2ex.send<AppObject.Captcha>(`/captchaImage`, 'get'),

  updatePwd: (oldPassword: string, newPassword: string) => v2ex.send<void>(`/system/user/profile/updatePwd`, 'put')
})
