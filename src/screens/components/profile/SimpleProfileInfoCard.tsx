/**
 * Created by leon<silenceace@gmail.com> on 22/05/27.
 */
import {Avatar, Text} from '@src/components'
import {translate} from '@src/i18n'
import {NavigationService, ROUTES} from '@src/navigation'
import {ITheme, useTheme} from '@src/theme'
import {AppObject} from '@src/types'
import dayjs from 'dayjs'
import React from 'react'
import {Image, StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native'
import {ProfileInfoStyle} from './profile'

/**
 * SimpleProfileInfoCard props
 */
export interface SimpleProfileInfoCardProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * profile info
   */
  info?: AppObject.Member
  /**
   * with right arrow
   */
  withArrow?: boolean
}

const SimpleProfileInfoCard: React.FC<SimpleProfileInfoCardProps> = ({
  info,
  containerStyle,
  withArrow = true
}: SimpleProfileInfoCardProps) => {
  const { theme } = useTheme()

  const renderContent = () => {
    return (
      <View style={[ProfileInfoStyle.container(theme), containerStyle]}>
        <TouchableOpacity
          onPress={() => {
            if (withArrow) NavigationService.navigate(ROUTES.Profile, { username: info?.user.userName })
          }}
          style={ProfileInfoStyle.infoItem(theme)}>
          <View style={ProfileInfoStyle.baseAvatar(theme)}>
            <Avatar
              size={60}
              source={info?.user.avatar_normal ? { uri: info?.user.avatar_normal } : undefined}
              username={info?.user.userName}
            />
          </View>
          <View style={ProfileInfoStyle.baseRightBox(theme)}>
            <View style={ProfileInfoStyle.baseRightInfo(theme)}>
              <Text
                style={[
                  ProfileInfoStyle.baseRightItem(theme),
                  styles.baseRightItem(theme),
                  theme.typography.subheadingText,
                  { color: theme.colors.secondary }
                ]}>
                {info?.user.userName}
              </Text>
              {info?.user.tagline ? (
                <Text
                  style={[
                    ProfileInfoStyle.baseRightItem(theme),
                    styles.baseRightItem(theme),
                    theme.typography.bodyText
                  ]}></Text>
              ) : null}
              {info ? (
                <Text
                  style={[
                    ProfileInfoStyle.baseRightItem(theme),
                    styles.baseRightItem(theme),
                    theme.typography.captionText
                  ]}>
                  {translate('label.v2exNumber').replace('$', info?.user.userName)}
                </Text>
              ) : null}
              {info?.user.createTime ? (
                <Text style={[ProfileInfoStyle.infoItem(theme), theme.typography.captionText]}>
                  {translate('label.joinSinceTime').replace('$', dayjs(info?.user.createTime).format())}
                </Text>
              ) : null}
            </View>
            {withArrow && (
              <View style={ProfileInfoStyle.baseRightArrow(theme)}>
                <Image source={theme.assets.images.icons.table.rightArrow} style={{ width: 14, height: 14 }} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return renderContent()
}

const styles = {
  baseRightItem: (theme: ITheme): ViewStyle => ({
    paddingBottom: theme.spacing.tiny
  })
}

export default SimpleProfileInfoCard
