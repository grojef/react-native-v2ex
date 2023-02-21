/**
 * Created by leon<silenceace@gmail.com> on 22/04/15.
 */

import * as React from 'react'
import {View, TouchableOpacity, ViewStyle, TextStyle, StyleProp, Linking} from 'react-native'
import {ITheme, AppObject} from '@src/types'
import {SylCommon, useTheme} from '@src/theme'
import {Avatar, Text} from '@src/components'
import dayjs from 'dayjs'
import {NavigationService, ROUTES} from '@src/navigation'
import {BorderLine, TextWithIconPress} from '../common'
import {useMemo} from 'react'
import {translate} from '@src/i18n'

export interface TopicCardItemProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * Display Style
   */
  displayStyle?: 'simple' | 'full' | 'auto'

  /**
   * Whether to show last reply users
   */
  showlastReplay?: boolean

  /**
   * Topic Info
   */
  topic: AppObject.Topic

  /**
   * Topic Title Press Event
   */
  onPress?: (topic: AppObject.Topic) => void
}

const TopicCardItem = ({
                         containerStyle,
                         displayStyle,
                         topic,
                         onPress
                       }: TopicCardItemProps) => {
  const {theme} = useTheme()

  return (
    <View style={[styles.container(theme), containerStyle]}>
      <View style={styles.infoContainer(theme)}>
        <Avatar
          size={50}
          source={undefined}
          style={styles.avatar(theme)}
        />
        <View style={styles.infoMain(theme)}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.infoMainItem(theme)]}
            onPress={() => {
              onPress && onPress(topic)
            }}>
            <Text type="body"
                  style={[styles.title(theme)]}>
              {topic.phoneNumber}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoMainItem(theme)}>
            <View style={styles.summaryContainer(theme)}>
              <TextWithIconPress
                containerStyle={[{marginRight: theme.spacing.small}]}
                text={topic.replies?.toString()}
                icon={theme.assets.images.icons.topic.comment}
              />
              <TextWithIconPress
                text={dayjs(topic.createTime, 'yyyy-MM-dd HH:mm:ss').fromNow()}
                icon={theme.assets.images.icons.topic.time}
              />
            </View>
            {displayStyle === 'full' && topic.batCode ? (
              <TextWithIconPress
                text={topic.batCode}
                onPress={() => {
                  onPress && onPress(topic)
                }}
                icon={theme.assets.images.icons.topic.paper}
                textStyle={[{color: theme.colors.secondary}]}
              />
            ) : (topic.callFlag == '1' &&
              <TextWithIconPress text={dayjs(topic.callTime, 'yyyy-MM-dd HH:mm:ss').fromNow()}/>
            )}
          </View>
        </View>
      </View>
      <BorderLine width={0.4}/>
    </View>
  )
}

const styles = {
  container: (theme: ITheme): ViewStyle => ({
    paddingTop: theme.spacing.small,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }),
  infoContainer: (theme: ITheme): ViewStyle => ({
    flexDirection: 'row',
    marginBottom: theme.spacing.tiny
  }),
  avatar: (theme: ITheme): ViewStyle => ({
    width: 40,
    marginRight: theme.spacing.large
  }),
  infoMain: (theme: ITheme): ViewStyle => ({
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }),
  infoMainItem: (theme: ITheme): ViewStyle => ({
    flexDirection: 'row',
    marginBottom: theme.spacing.small,
    justifyContent: 'space-between',
  }),
  summaryContainer: (theme: ITheme): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }),
  title: (theme: ITheme): TextStyle => ({
    ...theme.typography.bodyText,
  }),
  called: (): TextStyle => ({
    color: '#F00'
  })
}

export default TopicCardItem
