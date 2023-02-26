/**
 * Created by leon<silenceace@gmail.com> on 22/04/18.
 */

import {useToast} from '@src/components'
import {useSession} from '@src/hooks/useSession'
import {NODE_TABS} from '@src/navigation'
import {useTheme} from '@src/theme'
import {AppObject} from '@src/types'
import {ApiLib} from '@src/api'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {RefreshControl, StyleProp, ViewStyle} from 'react-native'
import {NeedLogin} from '../common'
import TopicCardList from './TopicCardList'
import CountDown from "@src/screens/components/topic/CountDown";

export interface FetchTopicCardListProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  nodeName: string
  v2API?: boolean
  /**
   * Display Style
   */
  displayStyle?: 'simple' | 'full' | 'auto'
  tag: string,
  fea: string
}

const FetchTopicCardList: React.FC<FetchTopicCardListProps> = ({
                                                                 nodeName,
                                                                 v2API = false,
                                                                 containerStyle,
                                                                 displayStyle,
                                                                 tag,
                                                                 fea
                                                               }: FetchTopicCardListProps) => {

  const {theme} = useTheme()
  const {logined} = useSession()
  const {showMessage} = useToast()
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [list, setList] = useState<AppObject.Topic[] | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadMore, setLoadMore] = useState<boolean>(false)
  const specialNode = useMemo(() => [NODE_TABS.LATEST, NODE_TABS.HOT].includes(nodeName), [nodeName])

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchTopics = useCallback(
    (pageNum: number) => {
      if (v2API && !logined) {
        return
      }

      if (pageNum > 1 && (!v2API || specialNode)) {
        setHasMore(false)
        return
      }

      if (pageNum === 1) {
        setList(undefined)
      }
      setRefreshing(pageNum === 1)
      setLoadMore(pageNum > 1)
      ;(nodeName != NODE_TABS.HOT
          ? ApiLib.topic.pager(nodeName, pageNum)
          : ApiLib.topic.intent(pageNum, tag, fea)
      )
        .then((rlt: AppObject.Topic[]) => {
          if (rlt.length === 0 || specialNode || !v2API) {
            setHasMore(false)
          }

          setRefreshing(false)
          setLoadMore(false)

          setList(rlt)
        })
        .catch((err) => {
          showMessage(err.message)
        })
    },
    [nodeName, showMessage, page, v2API, logined] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onRefresh = () => {
    setList(undefined)
    setPage(1)
    fetchTopics(1)
  }

  useEffect(() => {
    fetchTopics(page)
  }, [page, nodeName])

  const onReached = () => {
    if (hasMore && !loadMore && !refreshing) {
      setPage(page + 1)
    }
  }

  return (
    <NeedLogin
      onMount={() => {
      }}
      placeholderBackground={theme.colors.surface}>
      {nodeName == NODE_TABS.LATEST && <CountDown refreshData={fetchTopics}/>}
      <TopicCardList
        containerStyle={containerStyle}
        topics={list}
        displayStyle={displayStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        onEndReached={onReached}
        canLoadMoreContent={hasMore}
        searchIndicator={false}
        refreshCallback={onRefresh}
      />
    </NeedLogin>
  )
}

export default FetchTopicCardList
