/**
 * Created by leon<silenceace@gmail.com> on 22/4/19.
 */

import { AppObject } from '@src/types'
import { CACHE_EXPIRE_TIME } from '@src/config/constants'

export const memberFromCache = (
  userName: number | string,
  list?: { pullTime: number; info: AppObject.Member }[],
  cacheExpireTime: number = CACHE_EXPIRE_TIME
) => {
  if (!list || list.length === 0) {
    return undefined
  }
  return (
    list.find(
      (v) =>
        v.pullTime + cacheExpireTime > new Date().getTime() &&
        (typeof userName === 'number' ? v.info.user.userId === userName : v.info.user.userName === userName)
    )?.info ?? undefined
  )
}

export const nodeFromCache = (nodeid: number | string, list?: { pullTime: number; info: AppObject.Node }[]) => {
  if (!list || list.length === 0) {
    return undefined
  }
  return undefined
}
