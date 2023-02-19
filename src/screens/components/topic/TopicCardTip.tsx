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
import {AntOutline, ArrowDownCircleOutline} from 'antd-mobile-icons'

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

const TopicCardTip = ({
                        containerStyle,
                        displayStyle,
                        topic,
                        onPress
                      }: TopicCardItemProps) => {
  const {theme} = useTheme()

  const renderCall = (topic: any) => {
    return (topic.callFlag == '1' &&
      <View style={[styles.calledItem()]}><Text style={[styles.calledTag()]}>已拨打</Text></View>)
  }

  return (
    <View style={[styles.container(theme), containerStyle]}>
      <View style={styles.infoContainer(theme)}>
        <Avatar
          size={30}
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
                  style={[styles.title(theme), topic.callFlag == '1' && styles.called()]}>
              {topic.phoneNumber}
            </Text>
            {renderCall(topic)}
          </TouchableOpacity>
        </View>
        <View style={styles.infoMainItem(theme)}>
          {displayStyle === 'full' && topic.batCode ? (
            <TextWithIconPress
              text={topic.batCode}
              onPress={() => {
                onPress && onPress(topic)
              }}
              icon={theme.assets.images.icons.topic.paper}
              textStyle={[{color: theme.colors.secondary}]}
            />
          ) : null}
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
    width: 30,
    marginRight: theme.spacing.tiny
  }),
  infoMain: (theme: ITheme): ViewStyle => ({
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  }),
  infoMainItem: (theme: ITheme): ViewStyle => ({
    flexDirection: 'row',
    marginBottom: theme.spacing.small,
    justifyContent: 'flex-start',
  }),
  summaryContainer: (theme: ITheme): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }),
  title: (theme: ITheme): TextStyle => ({
    ...theme.typography.bodyText,
    paddingLeft: 10
  }),
  calledItem: (): ViewStyle => ({
    backgroundColor: 'rgba(255,0,0,0.78)',
    marginLeft: 10,
    borderRadius:6,
  }),
  calledTag: (): TextStyle => ({
    fontSize:10,
    color:'#FFF'
  }),
  called: (): TextStyle => ({
    color: 'red'
  })
}

export default TopicCardTip
