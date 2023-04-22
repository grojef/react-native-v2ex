/**
 * Created by leon<silenceace@gmail.com> on 22/04/18.
 */

import {SearchBar, useToast} from '@src/components'
import {useSession} from '@src/hooks/useSession'
import {SylCommon, useTheme} from '@src/theme'
import {AppObject} from '@src/types'
import {ApiLib} from '@src/api'
import React, {useCallback, useEffect, useState} from 'react'
import {RefreshControl, StyleProp, View, ViewStyle} from 'react-native'
import {BorderLine, NeedLogin} from '../common'
import TopicCardList from './TopicCardList'

export interface SearchTopicCardListProps {
    /**
     * container style
     */
    containerStyle?: StyleProp<ViewStyle>

}

const SearchTopicCardList: React.FC<SearchTopicCardListProps> = ({
                                                                     containerStyle,
                                                                 }: SearchTopicCardListProps) => {
    const {theme} = useTheme()
    const {logined} = useSession()
    const {showMessage} = useToast()
    const [page, setPage] = useState(1)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [list, setList] = useState<AppObject.Topic[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)

    const [phone, setPhone] = useState('')

    const fetchTopics = useCallback(
        (phone:string) => {
            setRefreshing(page === 1)
            ApiLib.topic.search(phone).then((rlt: AppObject.PageInfo<AppObject.Topic>) => {
                setRefreshing(false)
                setList(rlt.rows)
            }).catch((err) => {
                showMessage({text1: '温馨提示', text2: err.msg, type: 'error'})
            })
        },
        [showMessage, hasMore, logined,phone]
    )
    useEffect(() => {
        fetchTopics(phone)
    }, [phone])
    const onRefresh = () => {
        setList([])
        fetchTopics(phone);
    }

    return (
        <>
            <NeedLogin onMount={() => {
            }} placeholderBackground={theme.colors.surface}>
                <View style={[SylCommon.Card.container(theme),{marginBottom:5}]}>
                    <SearchBar
                        placeholder={'请输入搜索号码'}
                        onActiveSearch={(val) => {
                        }}
                        onSubmitSearch={(val) => {
                            setPhone(val)
                        }}
                        inputTextStyle={[{}]}
                        inputContainerStyle={[{borderRadius: 5}]}
                    />
                </View>
                <BorderLine/>
                <TopicCardList
                    containerStyle={containerStyle}
                    topics={list}
                    displayStyle={"search"}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    searchIndicator={false}
                    canLoadMoreContent={false}
                    refreshCallback={onRefresh}
                />
            </NeedLogin>
        </>
    )
}

export default SearchTopicCardList
