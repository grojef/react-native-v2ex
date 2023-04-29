/**
 * Created by leon<silenceace@gmail.com> on 22/05/21.
 */
import {Text} from '@src/components'
import {SylCommon, useTheme} from '@src/theme'
import {AppObject, ITheme} from '@src/types'
import dayjs from 'dayjs'
import React from 'react'
import {FlatList, StyleProp, TextStyle, View, ViewStyle} from 'react-native'
import {RenderHTML} from '../'
import {TextWithIconPress} from '../common'

export interface NotificationInfoProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  info: AppObject.Notification
}

const NotificationDetail: React.FC<NotificationInfoProps> = ({ containerStyle, info }: NotificationInfoProps) => {
  const { theme } = useTheme()

  const renderItemRow = ({ item }: { item: AppObject.Notification }) => {
    if (!item) return null
    return (
      <RenderHTML contentWidth={theme.dimens.WINDOW_WIDTH - theme.spacing.large * 2} htmlString={item.noticeContent} />
    )
  }

  const renderContent = () => {
    if (!info) return null
    return (
      <View style={[SylCommon.Card.container(theme)]}>
        <View style={styles.itemRight(theme)}>
          <View style={[styles.itemRightItem(theme), styles.textItem(theme)]}>
            <Text type={'body'} bold={true}>
              {info.noticeTitle}
            </Text>
          </View>
          <View style={[styles.itemRightItem(theme), styles.itemAction(theme)]}>
            <TextWithIconPress
              icon={theme.assets.images.icons.notification.time}
              text={dayjs(info.createTime, 'yyyy-MM-dd HH:mm:ss').fromNow()}
            />
          </View>
          <FlatList
            data={[info]}
            renderItem={renderItemRow}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            key={'ONE COLUMN'}
          />
        </View>
      </View>
    )
  }

  return <View style={containerStyle}>{renderContent()}</View>
}

/**
 * @description styles settings
 */
const styles = {
  itemContainer: (theme: ITheme): ViewStyle => ({
    display: 'flex',
    flex: 1,
    paddingTop: theme.spacing.small,
    flexDirection: 'row'
  }),
  itemLeft: (theme: ITheme): ViewStyle => ({
    width: 40,
    marginRight: 15
  }),
  itemRight: (theme: ITheme): ViewStyle => ({
    paddingTop: theme.spacing.small
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

export default NotificationDetail
