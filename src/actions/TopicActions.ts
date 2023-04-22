/**
 * Created by leon<silenceace@gmail.com> on 22/2/22.
 */

import {Dispatch} from 'redux'
import {ApiLib} from '@src/api'
import {logError} from '@src/helper/logger'

import {
    APP_NODE_LOAD_ERROR,
    APP_NODE_LOAD_MORE_TOPICS,
    APP_NODE_TOPICS_LOAD_SUCCESS,
    APP_NODE_TOPICS_REFRESH,
    AppObject,
    MEMBER_READ_TOPIC
} from '@src/types'
import {SPECIAL_NODE_NAME_MAP} from '@src/config/constants'

/**
 * 阅读主题
 * @param topic
 * @returns
 */
export const readTopic = (topic: AppObject.Topic) => ({
  type: MEMBER_READ_TOPIC,
  payload: topic
})

/**
 * 获取主题列表
 * @param node 节点name
 * @param page 获取页数
 * @returns
 */
export const getHomeNodeTopics =
  (node: string, page: number = 1, v2Use: boolean = false) =>
  async (dispatch: Dispatch) => {
    const specialNode = Object.values(SPECIAL_NODE_NAME_MAP).includes(node)
    const refreshing = page === 1 || specialNode
    const loadmore = !refreshing && page > 1

    if ((!v2Use || specialNode) && page > 1) {
      return
    }

    if (refreshing) {
      dispatch({
        type: APP_NODE_TOPICS_REFRESH,
        payload: { node }
      })
    } else if (loadmore) {
      dispatch({
        type: APP_NODE_LOAD_MORE_TOPICS,
        payload: { node }
      })
    }

    try {
      let _topics: AppObject.Topic[] = []
      if (specialNode) {
        if (node === SPECIAL_NODE_NAME_MAP.HOT) {
          _topics = await ApiLib.topic.hotTopics()
        } else if (node === SPECIAL_NODE_NAME_MAP.LATEST) {
          _topics = await ApiLib.topic.latestTopics()
        }
      } else {
      }

      dispatch({
        type: APP_NODE_TOPICS_LOAD_SUCCESS,
        payload: {
          node,
          data: _topics
        }
      })
    } catch (error) {
      logError(error)
      dispatch({
        type: APP_NODE_LOAD_ERROR,
        payload: {
          node,
          data: (error as any).message
        }
      })
    }
  }
