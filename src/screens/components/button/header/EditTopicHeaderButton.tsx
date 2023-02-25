/**
 * Created by leon<silenceace@gmail.com> on 22/05/27.
 */
import {followPeople, interestNode, unFollowPeople, unInterestNode} from '@src/actions'
import {useAppDispatch, useAppSelector} from '@src/hooks'
import {useSession} from '@src/hooks/useSession'
import {translate} from '@src/i18n'
import {NavigationService, ROUTES} from '@src/navigation'
import {useTheme} from '@src/theme'
import {AppObject} from '@src/types'
import React, {useEffect, useMemo, useState} from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import {HeaderButton} from '../../common'
import {ApiLib} from "@src/api";

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
                                 topicId
                               }: {
  containerStyle?: StyleProp<ViewStyle>
  topicId: number
}) => {
  const {theme} = useTheme()

  const buttonPress = () => {
    NavigationService.navigate(ROUTES.TopicEdit, {topicId: topicId})
  }

  return (
    <HeaderButton
      text={translate(`common.edit`)}
      textColor={theme.colors.secondary}
      onPress={buttonPress}
      containerStyle={containerStyle}
    />
  )
}

export default EditTopicHeaderButton
