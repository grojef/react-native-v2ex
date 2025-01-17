/**
 * Created by leon<silenceace@gmail.com> on 22/04/15.
 */

import * as React from 'react'
import {useState} from 'react'
import {StyleProp, TextStyle, TouchableOpacity, View, ViewStyle,} from 'react-native'
import {AppObject, ITheme} from '@src/types'
import {SylCommon, useTheme} from '@src/theme'
import {Avatar, Text, useToast} from '@src/components'
import {BorderLine, TextWithIconPress} from '../common'
import {ApiLib} from "@src/api";
import Dialer from "@src/components/dialer"
import {NavigationService, ROUTES} from "@src/navigation";
import dayjs from "dayjs";


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
  const {showMessage} = useToast()
  const renderCall = (tip: any) => {
    return (tip.callFlag == '1' && displayStyle == 'full' &&
      <View style={[styles.calledItem()]}><Text style={[styles.calledTag()]}>已拨打</Text></View>)
  }

  const [tip, setTip] = useState(topic);

  const fetchPhoneData = (tip: AppObject.Topic) => {
    ApiLib.topic.topic(tip.id).then((res) => {
      new Dialer().callPhone(res.phoneNumber, () => {
        ApiLib.topic.call(res.id).then(() => {
          setTimeout(() => {
            setTip({...tip, callFlag: '1'})
          }, 3000)
        })
      })
    }).catch(res => {
      showMessage({text1: "温馨提示", text2: res.msg, type: 'error'})
    })
  }

  const detail = (tip: AppObject.Topic) => {
    NavigationService.navigate(ROUTES.TopicDetail, {topicId: tip.id})
  }

  return (
    <View
      style={[styles.container(theme), SylCommon.Card.container(theme), containerStyle, styles.callBackground(displayStyle, tip)]}>
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
              displayStyle == 'full' ? fetchPhoneData(tip) : detail(tip)
            }}>
            <Text type="body"
                  style={[styles.title(theme, tip), styles.callDay(theme, tip), displayStyle == 'full' && tip.callFlag == '1' && styles.called()]}>
              {tip.phoneNumber}
            </Text>
            {displayStyle == 'simple' && <Text type="caption"
                                               style={[styles.nickName(theme, tip), styles.callDay(theme, tip)]}>
              {tip.nickName}
            </Text>}
            {renderCall(tip)}
          </TouchableOpacity>
        </View>
        <View style={styles.infoMainItem(theme)}>
          {tip.batCode ? (
            <TextWithIconPress
              text={tip.batCode}
              onPress={() => {
                detail(tip)
              }}
              textStyle={[styles.callDayTag(displayStyle, theme, tip)]}
            />
          ) : undefined}
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
  title: (theme: ITheme, tip: AppObject.Topic): TextStyle => ({
    ...theme.typography.bodyText,
    paddingLeft: 10,
  }),
  nickName: (theme: ITheme, tip: AppObject.Topic): TextStyle => ({
    ...theme.typography.bodyText,
    paddingLeft: 30,
  }),
  calledItem: (): ViewStyle => ({
    backgroundColor: 'rgba(255,0,0,0.78)',
    marginLeft: 10,
    borderRadius: 6,
  }),
  calledTag: (): TextStyle => ({
    fontSize: 10,
    color: '#FFF'
  }),
  called: (): TextStyle => ({
    color: 'rgba(255,0,0,0.78)'
  }),

  callDay: ((theme: ITheme, tip: AppObject.Topic): TextStyle => {
    if (dayjs().diff(dayjs((tip.callTime)), 'day') >= 7) {
      return {
        color: '#fff'
      }
    }
    return {
      color: '#111010',
    }
  }),

  callDayTag: ((displayStyle: "simple" | "full" | "auto" | undefined, theme: ITheme, tip: AppObject.Topic): TextStyle => {


    if (displayStyle == 'simple' && dayjs().diff(dayjs((tip.callTime)), 'day') >= 7) {
      return {
        color: '#fff'
      }
    }
    return {
      color: theme.colors.secondary,
    }
  }),

  callBackground: (displayStyle: "simple" | "full" | "auto" | undefined, tip: AppObject.Topic): TextStyle => {
    if (displayStyle == 'simple') {
      if (dayjs().diff(dayjs((tip.callTime)), 'day') > 14) {
        return {
          backgroundColor: '#586e58',
          color: '#fff'
        }
      } else if (dayjs().diff(dayjs((tip.callTime)), 'day') > 7) {
        return {
          backgroundColor: '#9d845c',
          color: '#fff'
        }
      }
    }
    return {
      backgroundColor: '#fff',
      color: '#111010'
    }
  }

}

export default TopicCardTip
