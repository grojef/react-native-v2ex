/**
 * Created by leon<silenceace@gmail.com> on 22/2/22.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import {MEMBER_TOKEN_KEY} from '@src/config/constants'
import {logError} from '@src/helper/logger'
import NavigationService from '@src/navigation/NavigationService'
import {RootState} from '@src/store'
import {ApiLib} from '@src/api'
import {Dispatch} from 'redux'
import {
  APP_AUTH,
  APP_AUTH_ERROR,
  APP_AUTH_LOADING,
  APP_AUTH_SUCCESS,
  APP_LOGOUT,
  AppObject,
  MEMBER_FOLLOW_PEOPLE,
  MEMBER_INSEREST_NODE,
  MEMBER_LIKE_TOPICS,
  MEMBER_PROFILE,
  MEMBER_SATE_SETTING,
  MEMBER_TOPICS,
  MEMBER_UNFOLLOW_PEOPLE,
  MEMBER_UNINTEREST_NODE,
  MEMBER_UNLIKE_TOPICS
} from '../types'
import {cacheMemberFollowing, cacheMemberInterestNodes, cacheMemberLikeTopicss} from './CacheAction'

export const myProfile = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const _member = await ApiLib.member.myProfile()
  dispatch({
    type: MEMBER_PROFILE,
    payload: _member
  })

  dispatch({
    type: MEMBER_SATE_SETTING,
    payload: {
      interestNodes: getState().cache.membersInterestNodes[_member.user.userId],
      followPeoples: getState().cache.membersFollowing[_member.user.userId],
      likeTopics: getState().cache.membersLikeTopics[_member.user.userId]
    }
  })
}

export const getToken = () => async (dispatch: Dispatch) => {
  dispatch({
    type: APP_AUTH_SUCCESS,
    payload: {}
  })
}

export const setMyTopics = (topics: AppObject.Topic[]) => ({
  type: MEMBER_TOPICS,
  payload: topics
})

export const interestNode = (node: AppObject.Node) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch({
    type: MEMBER_INSEREST_NODE,
    payload: node
  })
  dispatch(cacheMemberInterestNodes(getState().member.interestNodes))
}

export const unInterestNode = (node: AppObject.Node) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch({
    type: MEMBER_UNINTEREST_NODE,
    payload: node
  })
  dispatch(cacheMemberInterestNodes(getState().member.interestNodes))
}

export const likeTopic = (topic: AppObject.Topic) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch({
    type: MEMBER_LIKE_TOPICS,
    payload: topic
  })
  dispatch(cacheMemberLikeTopicss(getState().member.likeTopics))
}

export const unLikeTopic = (topic: AppObject.Topic) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch({
    type: MEMBER_UNLIKE_TOPICS,
    payload: topic
  })
  dispatch(cacheMemberLikeTopicss(getState().member.likeTopics))
}

export const followPeople = (member: AppObject.Member) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch({
    type: MEMBER_FOLLOW_PEOPLE,
    payload: member
  })
  dispatch(cacheMemberFollowing(getState().member.followPeoples))
}

export const unFollowPeople = (member: AppObject.Member) => async (dispatch: Dispatch, getState: () => RootState) => {
  dispatch({
    type: MEMBER_UNFOLLOW_PEOPLE,
    payload: member
  })
  dispatch(cacheMemberFollowing(getState().member.followPeoples))
}

export const setCurrentToken = (token?: AppObject.MemberToken) => ({
  type: APP_AUTH,
  payload: token
})

export const loginByToken = (loginId: string,password: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: APP_AUTH_LOADING })
    const token_info = await ApiLib.member.token(loginId,password)
    dispatch(loginByTokenSuccess(token_info) as any)
  } catch (e: any) {
    logError(e)
    loginByTokenFail(dispatch, e.msg)
  }
}

const loginByTokenSuccess = (token: AppObject.MemberToken) => async (dispatch: Dispatch, getState: () => RootState) => {
  await AsyncStorage.setItem(MEMBER_TOKEN_KEY, token.token)

  ApiLib.setToken(token.token)

  dispatch(setCurrentToken(token))

  dispatch({ type: APP_AUTH_SUCCESS, payload: token })

  dispatch(myProfile() as any)
}

const loginByTokenFail = (dispatch: Dispatch, message: string) => {
  AsyncStorage.removeItem(MEMBER_TOKEN_KEY)

  dispatch(errorMessage(message))
}
export const errorMessage = (error: string) => ({
  type: APP_AUTH_ERROR,
  payload: error
})

export const logout = () => (dispatch: Dispatch) => {
  AsyncStorage.setItem(MEMBER_TOKEN_KEY, '')
  ApiLib.setToken(undefined)
  ApiLib.member.logout().then(r => null)
  dispatch({ type: APP_LOGOUT })
  NavigationService.navigate('SignIn')
}
