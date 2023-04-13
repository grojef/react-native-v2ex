import { Store } from 'redux'
import { initV2ex, setCurrentToken, logout, cacheDict } from '../actions'

export const onAppStart = async (store: Store) => {
  store.dispatch(initV2ex() as any)
}
