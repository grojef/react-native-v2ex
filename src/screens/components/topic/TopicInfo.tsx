/**
 * Created by leon<silenceace@gmail.com> on 22/04/01.
 */
import {ITheme, SylCommon, useTheme} from '@src/theme'
import {AppObject} from '@src/types'
import React from 'react'
import {StyleProp, View, ViewStyle} from 'react-native'
import {RenderHTML} from '../common'
import TopicCardItem from './TopicCardItem'
import {ApiLib} from "@src/api";
import Dialer from "@src/components/dialer";

/**
 * TopicInfo props
 */
export interface TopicInfoProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * TopicInfo width
   */
  info: AppObject.Topic
}

const TopicInfo: React.FC<TopicInfoProps> = ({containerStyle, info}: TopicInfoProps) => {
  const {theme} = useTheme()

  const renderContent = () => {
    return (
      <View style={[SylCommon.Card.container(theme), styles.container(theme), containerStyle]}>
        <TopicCardItem
          topic={info}
          displayStyle={'full'}
          onPress={() => {
            new Dialer().callPhone(info.phoneNumber, () => {
              ApiLib.topic.call(info.id);
            })
          }}
        />
        <RenderHTML
          htmlString={info.content_rendered}
          contentWidth={theme.dimens.WINDOW_WIDTH - theme.spacing.large * 2}
        />
      </View>
    )
  }

  return renderContent()
}

const styles = {
  container: (theme: ITheme): ViewStyle => ({
    paddingVertical: theme.spacing.medium
  })
}

export default TopicInfo
