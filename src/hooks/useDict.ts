/**
 * Created by leon<silenceace@gmail.com> on 22/4/19.
 */
import { RootState } from '@src/store'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { cacheDict } from '../actions'
import { AppObject } from '../types'

export const useDict = () => {
  const dictValue = useAppSelector((_state: RootState) => _state.cache.dict)
  const [dict, setDict] = useState<Map<string, Array<AppObject.DictMeta>>>()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (dictValue !== undefined) {
      setDict(dictValue)
    } else {
      dispatch(cacheDict() as any)
    }
  }, [dictValue, dict]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    dict: dict
  }
}
export const findDict = (dictType: any, dictValue: any) => {
  const { dict } = useDict()
  return dict ? [dictType].find((s) => s.dictValue == dictValue)?.dictLabel : ''
}
