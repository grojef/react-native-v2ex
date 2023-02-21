import AsyncStorage from '@react-native-async-storage/async-storage'
import {Store} from 'redux'
import {ApiLib} from '@src/api'
import {initV2ex, setCurrentToken, logout, cacheDict,} from '../actions'
import {MEMBER_TOKEN_KEY} from '@src/config/constants'
import {logError} from './logger'
import {useDict} from "@src/hooks/useDict";

export const onAppStart = async (store: Store) => {
    store.dispatch(initV2ex() as any)
}
