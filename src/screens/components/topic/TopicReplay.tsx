/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import { Placeholder } from '@src/components'
import { translate } from '@src/i18n'
import { ITheme, useTheme } from '@src/theme'
import { AppObject } from '@src/types'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { ReplayList } from '.'
import { NeedLogin, TabCardContainer } from '../common'

/**
 * TopicReplay props
 */
export interface TopicReplayProps {
  containerStyle?: StyleProp<ViewStyle>

  info: AppObject.Topic
}

const TopicReplay: React.FC<TopicReplayProps> = ({ containerStyle, info }: TopicReplayProps) => {
  const { theme } = useTheme()
  const [list, setList] = React.useState<AppObject.TopicReply[] | undefined>(undefined)

  const refreshCallback = (_list: AppObject.TopicReply[]) => {
    setList(_list)
  }

  const renderContent = () => {
    return (
      <>
      </>
    )
  }

  return renderContent()
}

const styles = {
  container: (theme: ITheme): ViewStyle => ({
    marginTop: theme.spacing.small,
    flex: 1
  })
}

export default TopicReplay
