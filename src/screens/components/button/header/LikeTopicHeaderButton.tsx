/**
 * Created by leon<silenceace@gmail.com> on 22/05/27.
 */
import { likeTopic, unLikeTopic } from '@src/actions'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { useSession } from '@src/hooks/useSession'
import { translate } from '@src/i18n'
import { NavigationService, ROUTES } from '@src/navigation'
import { useTheme } from '@src/theme'
import { AppObject } from '@src/types'
import React, { useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { HeaderButton } from '../../common'

/**
 * Like Topic Button
 * @param {
 *   text,
 *   buttonText,
 *   buttonPress
 * }
 * @returns
 */
const LikeTopicHeaderButton = ({
  containerStyle,
  topic
}: {
  containerStyle?: StyleProp<ViewStyle>
  topic: AppObject.Topic
}) => {
  const { theme } = useTheme()
  const { logined } = useSession()

  const dispatch = useAppDispatch()
  const buttonPress = () => {
    if (!logined) {
      NavigationService.navigate(ROUTES.SignIn)
    } else {
      NavigationService.navigate(ROUTES.My)
    }
  }

  return (
    <HeaderButton
      text={translate(`common.edit`)}
      textColor={theme.colors.captionText}
      onPress={buttonPress}
      containerStyle={containerStyle}
    />
  )
}

export default LikeTopicHeaderButton
