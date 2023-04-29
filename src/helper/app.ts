import {Store} from 'redux'
import {initV2ex} from '../actions'
import callDetector from "@src/components/call";

export const onAppStart = async (store: Store) => {
  store.dispatch(initV2ex() as any)
  callDetector.startListenerTapped()
}
