/**
 * Created by leon<silenceace@gmail.com> on 22/05/21.
 */
import { Placeholder, SearchBar, Spinner, Text, useToast } from '@src/components'
import { useSession } from '@src/hooks/useSession'
import { translate } from '@src/i18n'
import { useTheme } from '@src/theme'
import { AppObject, ITheme } from '@src/types'
import { ApiLib } from '@src/api'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { NeedLogin } from '../'
import { BorderLine, TextWithIconPress } from '../common'
import NavigationService from '@src/navigation/NavigationService'
import { ROUTES } from '@src/navigation'
import { defaultDictMeta } from '@src/helper/defaultDictMeta'

export interface VisitInfoListFcProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>
}

const VisitInfoListFc: React.FC<VisitInfoListFcProps> = ({ containerStyle }: VisitInfoListFcProps) => {
  const { theme } = useTheme()
  const { logined } = useSession()
  const { showMessage } = useToast()
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [list, setList] = useState<AppObject.VisitInfo[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadMore, setLoadMore] = useState<boolean>(false)

  const [searcher, setSearcher] = useState('')

  const fetchVisitInfos = useCallback(
    (pageNum: number, searcher: string) => {
      if (!logined || (pageNum > 1 && !hasMore)) {
        return
      }

      if (pageNum === 1) {
        setList([])
      }
      setRefreshing(pageNum === 1)
      setLoadMore(pageNum > 1)
      ApiLib.visit
        .list(pageNum, searcher)
        .then((rlt: AppObject.VisitInfo[]) => {
          if (rlt.length === 0 && pageNum > 1) {
            setHasMore(false)
          }
          setRefreshing(false)
          setLoadMore(false)
          setList(rlt)
        })
        .catch((err) => {
          showMessage({ text1: '温馨提示', text2: err.msg, type: 'error' })
        })
    },
    [showMessage, page, logined, searcher]
  )

  const onRefresh = useCallback(() => {
    setPage(1)
    fetchVisitInfos(page, searcher)
  }, [searcher])

  useEffect(() => {
    onRefresh()
  }, [searcher])

  useEffect(() => {
    ApiLib.dict.dict('oa_address').then((res) => {
      res.unshift(defaultDictMeta)
      setAddress(res)
    })
    ApiLib.dict.dict('oa_visit_type1').then((res) => {
      res.unshift(defaultDictMeta)
      setVisit1(res)
    })
  }, [])

  const [address, setAddress] = useState<AppObject.DictMeta[]>([])
  const [visit1, setVisit1] = useState<AppObject.DictMeta[]>([])

  const findDict = (dict: AppObject.DictMeta[], dictValue: any) => {
    if (dictValue) {
      return dict ? dict.find((s) => s.dictValue == dictValue)?.dictLabel : ''
    } else {
      return ''
    }
  }

  const renderItemRow = (item: any) => {
    if (!item) return null
    return (
      <View style={[styles.itemContainer(theme)]}>
        <View style={styles.itemRight(theme)}>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate(ROUTES.VisitInfo, { visitId: item?.id })
            }}>
            <View style={styles.itemRightItem(theme)}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ textAlign: 'left', fontSize: 14, flex: 1 }}>{item.visitor}</Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    flex: 1
                  }}>
                  {findDict(visit1, item.visitType1)}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    flex: 1
                  }}>
                  {findDict(address, item.address)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemRightItem(theme), styles.itemAction(theme)]}>
            <TextWithIconPress
              onPress={() => {
                NavigationService.navigate(ROUTES.VisitInfo, { visitId: item?.id })
              }}
              icon={theme.assets.images.icons.notification.time}
              text={item.visitTime}
            />
            <TextWithIconPress
              onPress={() => {
                NavigationService.navigate(ROUTES.VisitInfo, { visitId: item?.id })
              }}
              icon={theme.assets.images.icons.notification.action}
            />
          </View>
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    if (loadMore) {
      return <Spinner style={{ padding: theme.spacing.large }} />
    } else if (list && list.length > 0) {
      return <Placeholder placeholderText={translate('tips.noMore')} />
    }
    return null
  }

  const onReached = () => {
    if (hasMore && !loadMore && !refreshing) {
      setPage(page + 1)
    }
  }

  const renderItemSeparator = () => <BorderLine />

  const renderRefreshControl = () => <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

  const renderContent = () => {
    if (!list) {
      return <Placeholder placeholderText={translate('tips.noMore')} />
    }
    return (
      <FlatList
        refreshControl={renderRefreshControl()}
        data={list}
        renderItem={({ item, index }) => {
          return renderItemRow(item)
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onReached}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        numColumns={1}
        key={'ONE COLUMN'}
        ItemSeparatorComponent={renderItemSeparator}
      />
    )
  }

  const TableHeader = () => (
    <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey' }}>
      <Text style={{ textAlign: 'left', flex: 1, fontWeight: 'bold' }}>称呼</Text>
      <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>回款</Text>
      <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>楼层</Text>
    </View>
  )

  return (
    <NeedLogin
      onMount={() => {
        onRefresh()
      }}>
      <View style={containerStyle}>
        <View style={{ marginBottom: 6 }}>
          <SearchBar
            onActiveSearch={(val) => {}}
            onSubmitSearch={(val) => {
              setSearcher(val)
            }}
            inputTextStyle={[{}]}
            inputContainerStyle={[{ borderRadius: 5 }]}
          />
        </View>
        {TableHeader()}
        <BorderLine />
        {renderContent()}
      </View>
    </NeedLogin>
  )
}

/**
 * @description styles settings
 */
const styles = {
  itemContainer: (theme: ITheme): ViewStyle => ({
    flex: 1,
    paddingTop: theme.spacing.small,
    flexDirection: 'row'
  }),
  itemLeft: (theme: ITheme): ViewStyle => ({
    width: '10%',
    flex: 1,
    flexDirection: 'column'
  }),
  itemRight: (theme: ITheme): ViewStyle => ({
    flex: 1,
    width: '90%',
    flexDirection: 'column'
  }),
  itemRightItem: (theme: ITheme): TextStyle => ({
    marginBottom: theme.spacing.small
  }),
  textItem: (theme: ITheme): TextStyle => ({
    marginBottom: theme.spacing.small,
    fontSize: 10
  }),
  itemAction: (theme: ITheme): ViewStyle => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  })
}

export default VisitInfoListFc
