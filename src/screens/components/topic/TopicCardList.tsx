import { Placeholder, Spinner } from '@src/components'
import { translate } from '@src/i18n'
import { SylCommon, useTheme } from '@src/theme'
import { AppObject, IState, ITheme } from '@src/types'
import React, { memo } from 'react'
import { FlatList, ListRenderItem, StyleProp, View, ViewStyle } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import TopicCardTip from './TopicCardTip'
import { connect } from 'react-redux'

export interface TopicCardListProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  itemContainerStyle?: StyleProp<ViewStyle>

  onRowPress?: (topic: AppObject.Topic) => void
  canLoadMoreContent?: boolean
  topics?: Array<AppObject.Topic>
  onEndReached?: () => void
  refreshControl?: React.ReactElement
  searchIndicator?: boolean
  refreshCallback?: () => void
  /**
   * Display Style
   */
  displayStyle?: 'simple' | 'full' | 'auto'
  app: IState.AppState
  useFlatList?: boolean
}

const TopicCardList: React.FC<TopicCardListProps> = ({
  app,
  useFlatList = true,
  containerStyle,
  itemContainerStyle,
  canLoadMoreContent,
  displayStyle,
  topics,
  onEndReached,
  refreshControl,
}: TopicCardListProps) => {
  const { theme } = useTheme()

  const RenderItem = memo(({ item }: { item: AppObject.Topic }) => {
    return (
      <Animated.View key={item.id}>
        <TopicCardTip
          displayStyle={displayStyle}
          containerStyle={[styles.topicItemContainer(theme), itemContainerStyle]}
          topic={item}
        />
      </Animated.View>
    )
  })

  const renderItemRow: ListRenderItem<AppObject.Topic> = ({ item }) => {
    return <RenderItem item={item} />
  }
  const renderFooter = () => {
    if (canLoadMoreContent) {
      return <Spinner style={{ padding: theme.spacing.large }} />
    } else if (topics && topics.length > 0) {
      return (
        <Placeholder
          containerStyle={[{ backgroundColor: theme.colors.background }]}
          placeholderText={translate('tips.noMore')}
        />
      )
    }
    return null
  }

  const renderItemSeparator = () => <View style={styles.itemSeparator(theme)} />

  const renderContent = () => {
    if (!topics) {
      return <Spinner style={{ marginTop: 50 }} />
    }

    return (
      <FlatList
        refreshControl={refreshControl}
        style={styles.container(theme)}
        data={topics}
        renderItem={renderItemRow}
        keyExtractor={(item) => item.id + ''}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        key={'ONE COLUMN'}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        ItemSeparatorComponent={renderItemSeparator}
      />
    )
  }

  return <View style={[styles.container(theme), containerStyle]}>{renderContent()}</View>
}

/**
 * @description styles settings
 */
const styles = {
  container: (theme: ITheme): ViewStyle => ({
    flex: 1
  }),
  topicItemContainer: (theme: ITheme): ViewStyle => ({
    ...SylCommon.Card.container(theme)
  }),
  itemSeparator: (theme: ITheme) => ({
    height: 0
  }),
  refreshContainer: (theme: ITheme): ViewStyle => ({
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small,
    backgroundColor: '#fff',
    flexDirection: 'row'
  }),
  refreshBox: (): ViewStyle => ({
    flex: 1,
    justifyContent: 'space-between',
    height: 50,
    padding: 10
  })
}

const mapStateToProps = ({ app }: { app: IState.AppState }) => {
  return { app }
}

export default connect(mapStateToProps)(TopicCardList)
