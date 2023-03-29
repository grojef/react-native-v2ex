import { AppAPI, AppObject } from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.VisitPI => ({
  /**
   * Get my latest notifications
   */
  list: (page: number, searcher: string) =>
    v2ex.get<AppObject.VisitInfo[]>(
      `/cms/visitInfo/list`,
      undefined,
      {
        pageNum: `${page}`,
        visitor: searcher,
        pageSize: '20'
      },
      undefined
    ),

  /**
   * get the notification information
   * @param visitId
   */
  info: (visitId: number) =>
    v2ex.get<AppObject.VisitInfo>(`/cms/visitInfo/${visitId}`, undefined, undefined, undefined),

  /**
   * save notification
   */
  save: (visitInfo: AppObject.VisitInfo) => {
    return v2ex.send<void>('/cms/visitInfo', 'PUT', undefined, undefined, visitInfo)
  },
  /**
   * add by client
   * @param visitInfo
   */
  add: (visitInfo: AppObject.VisitInfo) => {
    return v2ex.send<void>('/cms/visitInfo', 'POST', undefined, undefined, visitInfo)
  }
})
