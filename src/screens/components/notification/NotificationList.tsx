/**
 * Created by leon<silenceace@gmail.com> on 22/05/21.
 */
import {Avatar, Placeholder, Spinner, useToast} from '@src/components'
import {useMember} from '@src/hooks/useMember'
import {useSession} from '@src/hooks/useSession'
import {translate} from '@src/i18n'
import {SylCommon, useTheme} from '@src/theme'
import {ITheme, AppObject} from '@src/types'
import {ApiLib} from '@src/api'
import dayjs from 'dayjs'
import React, {useCallback, useState} from 'react'
import {
  FlatList,
  RefreshControl,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import {NeedLogin} from '../'
import {BorderLine, TextWithIconPress} from '../common'
import {Text} from "@src/components"
import NavigationService from "@src/navigation/NavigationService";
import {ROUTES} from "@src/navigation";

export interface NotificationListProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>
}

const NotificationList: React.FC<NotificationListProps> = ({containerStyle}: NotificationListProps) => {
  const {theme} = useTheme()
  const {logined} = useSession()
  const {showMessage} = useToast()
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [list, setList] = useState<AppObject.Notification[] | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadMore, setLoadMore] = useState<boolean>(false)

  const fetchNotifications = useCallback(
    (pageNum: number) => {
      if (!logined || (pageNum > 1 && !hasMore)) {
        return
      }

      if (pageNum === 1) {
        setList(undefined)
      }

      setRefreshing(pageNum === 1)

      setLoadMore(pageNum > 1)

      ApiLib.notification
        .list(pageNum)
        .then((rlt: AppObject.Notification[]) => {
          if (rlt.length === 0 && pageNum > 1) {
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
    [showMessage, page, logined]
  )

  const onRefresh = useCallback(() => {
    setPage(1)
    fetchNotifications(page)
  }, [])


  const renderItemRow = ({item}: { item: AppObject.Notification }) => {
    if (!item) return null
    return (
      <View style={[styles.itemContainer(theme), SylCommon.Card.container(theme)]}>
        <View style={styles.itemRight(theme)}>
          <TouchableOpacity onPress={() => {
            NavigationService.navigate(ROUTES.NotificationInfo, {noticeId: item?.noticeId})
          }}>
            <View style={styles.itemRightItem(theme)}>
              <Text>{item.noticeTitle}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemRightItem(theme), styles.itemAction(theme)]}>
            <TextWithIconPress
              icon={theme.assets.images.icons.notification.time}
              text={dayjs(item.createTime, 'yyyy-MM-dd HH:mm:ss').fromNow()}
            />
            <TextWithIconPress icon={theme.assets.images.icons.notification.action}/>
          </View>
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    if (loadMore) {
      return <Spinner style={{padding: theme.spacing.large}}/>
    } else if (list && list.length > 0) {
      return <Placeholder placeholderText={translate('tips.noMore')}/>
    }
    return null
  }

  const onReached = () => {
    if (hasMore && !loadMore && !refreshing) {
      setPage(page + 1)
    }
  }

  const renderItemSeparator = () => <BorderLine/>

  const renderRefreshControl = () => <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>

  const renderContent = () => {
    if (!list) {
      return <Spinner style={{marginTop: 50}}/>
    }
    return (
      <FlatList
        refreshControl={renderRefreshControl()}
        data={list}
        renderItem={renderItemRow}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={onReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        numColumns={1}
        key={'ONE COLUMN'}
        ItemSeparatorComponent={renderItemSeparator}
      />
    )
  }

  return (
    <NeedLogin
      onMount={() => {
        onRefresh()
      }}>
      <View style={containerStyle}>{renderContent()}</View>
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
    width: 40,
    marginRight: 15
  }),
  itemRight: (theme: ITheme): ViewStyle => ({
    flex: 1,
    flexDirection: 'column'
  }),
  itemRightItem: (theme: ITheme): TextStyle => ({
    marginBottom: theme.spacing.medium
  }),
  textItem: (theme: ITheme): TextStyle => ({
    marginBottom: theme.spacing.medium,
    fontSize: 10
  }),
  itemAction: (theme: ITheme): ViewStyle => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  })
}

export default NotificationList
