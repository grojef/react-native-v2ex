/**
 * Created by leon<silenceace@gmail.com> on 22/05/27.
 */

import {translate} from '@src/i18n'
import {useTheme} from '@src/theme'
import React from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import {HeaderButton} from '../../common'

/**
 * Follow People Button
 * @param {
 *   text,
 *   buttonText,
 *   buttonPress
 * }
 * @returns
 */
const EditTopicHeaderButton = ({
                                 containerStyle,
                                 onPress,
                                 text,
                               }: {
  containerStyle?: StyleProp<ViewStyle>
  onPress: () => void
  text?: string
}) => {
  const {theme} = useTheme()

  return (
    <HeaderButton
      text={text ? text : translate(`common.save`)}
      textColor={theme.colors.secondary}
      onPress={onPress}
      containerStyle={containerStyle}
    />
  )
}

export default EditTopicHeaderButton
