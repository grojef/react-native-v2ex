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
import {BorderLine, NeedLogin} from '../common'
import TopicCardList from './TopicCardList'
import CountDown from '@src/screens/components/topic/CountDown'
import SearchIntent from '@src/screens/components/topic/SearchIntent'

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
}

const FetchTopicCardList: React.FC<FetchTopicCardListProps> = ({
  nodeName,
  v2API = false,
  containerStyle,
  displayStyle
}: FetchTopicCardListProps) => {
  const { theme } = useTheme()
  const { logined } = useSession()
  const { showMessage } = useToast()
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [list, setList] = useState<AppObject.Topic[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadMore, setLoadMore] = useState<boolean>(false)

  const [searchData, setSearchData] = useState<{ qTag: string; qFeat: string }>({
    qTag: '',
    qFeat: ''
  })

  const onSearchDataChange = (newData: { qTag: string; qFeat: string }) => {
    setSearchData(newData)
    setHasMore(true)
    setList([])
    setPage(1)
  }

  useEffect(() => {
    fetchTopics(searchData.qTag, searchData.qFeat)
  }, [page, nodeName, searchData.qTag, searchData.qFeat])

  const fetchTopics = useCallback(
    (qTag: string, qFeat: string) => {
      setRefreshing(page === 1)
      setLoadMore(page > 2)
      ;(nodeName != NODE_TABS.HOT ? ApiLib.topic.only(nodeName, page) : ApiLib.topic.intent(page, qTag, qFeat))
        .then((rlt: AppObject.PageInfo<AppObject.Topic>) => {
          setRefreshing(false)
          setLoadMore(false)
          if (rlt.total / 20 <= page) {
            setHasMore(false)
          }
          if (page === 1) {
            setList(rlt.rows)
          } else {
            setList(list.concat(rlt.rows))
          }
        })
        .catch((err) => {
          showMessage({ text1: '温馨提示', text2: err.msg, type: 'error' })
        })
    },
    [nodeName, showMessage, page, hasMore, logined, JSON.stringify(searchData)]
  )

  const onRefresh = () => {
    setList([])
    setPage(1)
    setHasMore(true)
    fetchTopics(searchData.qTag, searchData.qFeat)
  }

  const onReached = () => {
    if (hasMore && !loadMore && !refreshing) {
      setPage(page + 1)
    }
  }

  const memoCountDown = useMemo(() => {
    return <CountDown refreshData={() => fetchTopics(searchData.qTag, searchData.qFeat)} />
  }, [])

  return (
    <>
      <NeedLogin onMount={() => {}} placeholderBackground={theme.colors.surface}>
        {nodeName == NODE_TABS.LATEST && memoCountDown}
        {nodeName == NODE_TABS.HOT && <SearchIntent refreshData={searchData} onDataChange={onSearchDataChange} />}
        <BorderLine />
        <TopicCardList
          containerStyle={containerStyle}
          topics={list}
          displayStyle={displayStyle}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={onReached}
          canLoadMoreContent={hasMore && !refreshing}
          searchIndicator={false}
          refreshCallback={onRefresh}
        />
      </NeedLogin>
    </>
  )
}

export default FetchTopicCardList
