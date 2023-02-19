import { AppAPI, AppObject } from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.NotificationAPI => ({

  /**
   * Get my latest notifications
   */
  list: (page: number) =>
    v2ex.get<AppObject.Notification[]>(`/system/notice/list?pageNum=${page}&pageSize=200`, undefined, undefined, undefined, ),

  /**
   * get the notification information
   * @param noticeId
   */
  info: (noticeId: number) =>
      v2ex.get<AppObject.Notification>(`/system/notice/${noticeId}`, undefined, undefined, undefined),

  /**
   * Remove notification
   */
  remove: (id: string) => v2ex.delete<any>(`/notifications/${id}`, undefined, undefined, )
})
