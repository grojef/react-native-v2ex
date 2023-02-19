/**
 * Created by leon<silenceace@gmail.com> on 22/4/19.
 */
import { CACHE_EXPIRE_TIME } from '@src/config/constants'
import { memberFromCache } from '@src/helper/cache'
import { RootState } from '@src/store'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { cacheMember } from '../actions'
import { AppObject } from '../types'

export const useMember = ({ userName: userName, forcePull = true }: { userName: string | number; forcePull?: boolean }) => {
  const members = useAppSelector((_state: RootState) => _state.cache.members)
  const [info, setInfo] = useState<AppObject.Member | undefined>(memberFromCache(userName, members))

  const dispatch = useAppDispatch()

  useEffect(() => {
    const _info = memberFromCache(userName, members, forcePull ? 5 * 1000 : CACHE_EXPIRE_TIME)
    if (_info !== undefined) {
      setInfo(_info)
    } else {
      dispatch(cacheMember(userName) as any)
    }
  }, [userName, info, members]) // eslint-disable-line react-hooks/exhaustive-deps
  return {
    member: info
  }
}
