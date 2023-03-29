import { AppAPI, AppObject } from '../../types'

export default (v2ex: AppAPI.APP): AppAPI.DictAPI => ({
  dict: (dictType: string) =>
    v2ex.get<AppObject.DictMeta[]>(`/system/dict/data/type/${dictType}`, undefined, undefined, undefined)
})
