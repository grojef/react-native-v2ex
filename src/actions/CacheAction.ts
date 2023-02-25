/**
 * Created by leon<silenceace@gmail.com> on 22/4/19.
 */
import {logError} from '@src/helper/logger'
import {AppDispatch} from '@src/store'
import {ApiLib} from '@src/api'

import {
    APP_ALL_NODE_INFO,
    APP_CACHE_ADD_DICT,
    APP_CACHE_ADD_MEMBER,
    APP_CACHE_ADD_NODE, APP_CACHE_DELAY_TIME,
    APP_CACHE_MEMBER_FOLLOWING,
    APP_CACHE_MEMBER_INTEREST_NODES,
    APP_CACHE_MEMBER_LIKE_TOPICS,
    APP_CACHE_RESET,
    APP_CACHE_RESET_MEMBERS,
    APP_CACHE_RESET_NODES, AppAPI,
    AppObject
} from '../types'
import {DictTypes} from "@config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const cacheMember = (userid: string | number) => async (dispatch: AppDispatch) => {
    try {
        const member = await ApiLib.member.myProfile()
        dispatch({
            type: APP_CACHE_ADD_MEMBER,
            payload: member
        })
    } catch (e: any) {
        logError(e)
    }
}

// @ts-ignore
export const cacheDict = () => async (dispatch: AppDispatch,) => {
    try {
        const dictMap: Map<string, Array<AppObject.DictMeta>> = new Map<string, Array<AppObject.DictMeta>>()
        for (let i = 0; i < DictTypes.length; i++) {
            dictMap.set(DictTypes[i], await ApiLib.dict.dict(DictTypes[i]))
        }
        dispatch({
            type: APP_CACHE_ADD_DICT,
            payload: dictMap
        })
        return dictMap
    } catch (e: any) {
        logError(e)
    }
}

export const cacheCounter = (counter: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch({
            type: APP_CACHE_DELAY_TIME,
            payload: counter
        })
    } catch (e: any) {
        logError(e)
    }
}

export const cacheNode = (nodeid: string | number) => async (dispatch: AppDispatch) => {
    try {
        const node = await ApiLib.node.get(nodeid, undefined)
        return dispatch({
            type: APP_CACHE_ADD_NODE,
            payload: node
        })
    } catch (e: any) {
        logError(e)
    }
}

export const cacheMemberFollowing = (members: AppObject.Member[] | undefined) => ({
    type: APP_CACHE_MEMBER_FOLLOWING,
    payload: members
})

export const cacheMemberInterestNodes = (nodes: AppObject.Node[] | undefined) => ({
    type: APP_CACHE_MEMBER_INTEREST_NODES,
    payload: nodes
})

export const cacheMemberLikeTopicss = (topics: AppObject.Topic[] | undefined) => ({
    type: APP_CACHE_MEMBER_LIKE_TOPICS,
    payload: topics
})

export const resetCache = (type: 'all' | 'nodes' | 'members') => ({
    type: type === 'nodes' ? APP_CACHE_RESET_NODES : type === 'members' ? APP_CACHE_RESET_MEMBERS : APP_CACHE_RESET
})
