/**
 * Created by leon<silenceace@gmail.com> on 22/04/01.
 */
import { Avatar, Text } from '@src/components'
import { translate } from '@src/i18n'
import { NavigationService, ROUTES } from '@src/navigation'
import { useTheme } from '@src/theme'
import { AppObject } from '@src/types'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import { TextWithIconPress } from '../common'
import { ProfileInfoStyle } from './profile'

/**
 * ProfileInfo props
 */
export interface ProfileInfoProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * card style
   */
  styleType?: 'simple' | 'full'
  /**
   * profile info
   */
  info?: AppObject.Member
  /**
   * with right arrow
   */
  withArrow?: boolean
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  info,
  containerStyle,
  styleType = 'simple',
  withArrow = false
}: ProfileInfoProps) => {
  const { theme } = useTheme()
  const isLogin = useMemo(() => info && info.user.userName, [info])

  const renderContent = () => {
    return (
      <View style={[ProfileInfoStyle.container(theme), containerStyle]}>
        <TouchableOpacity
          onPress={() =>
            !withArrow
              ? undefined
              : isLogin
              ? NavigationService.navigate(ROUTES.Profile, { userName: info?.user.userName })
              : NavigationService.navigate(ROUTES.SignIn)
          }
          style={ProfileInfoStyle.infoItem(theme)}>
          <View style={ProfileInfoStyle.baseAvatar(theme)}>
            <Avatar
              size={60}
              source={info?.user.avatar_normal ? { uri: info?.user.avatar_normal } : undefined}
              username={info?.user.nickName}
            />
          </View>
          <View style={ProfileInfoStyle.baseRightBox(theme)}>
            <View style={ProfileInfoStyle.baseRightInfo(theme)}>
              <Text
                style={[
                  ProfileInfoStyle.baseRightItem(theme),
                  theme.typography.subheadingText,
                  { color: theme.colors.secondary }
                ]}>
                {info?.user.nickName ?? translate('label.goLogin')}
              </Text>
              {info?.user.createTime ? (
                <Text style={[ProfileInfoStyle.baseRightItem(theme), theme.typography.captionText]}>
                  {translate('label.profileLastModified').replace(
                    '$',
                    dayjs(info?.user.createTime).format('YYYY-MM-DD HH:mm:ss')
                  )}
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
        {styleType === 'full' && (
          <>
            {info?.user.bio ? (
              <Text style={[ProfileInfoStyle.infoItem(theme), theme.typography.bodyText]}>{info?.user.bio}</Text>
            ) : null}

            {info && (info.user.location || info.user.website) ? (
              <View style={ProfileInfoStyle.infoItem(theme)}>
                {info?.user.location ? (
                  <TextWithIconPress
                    containerStyle={{ marginRight: theme.spacing.small }}
                    text={info?.user.location}
                    icon={theme.assets.images.icons.profile.location}
                  />
                ) : null}
                {info?.user.website ? (
                  <TextWithIconPress
                    onPress={() => {
                      NavigationService.navigate(ROUTES.WebViewer, { url: info.user.website })
                    }}
                    containerStyle={{ marginRight: theme.spacing.small }}
                    text={info?.user.website}
                    icon={theme.assets.images.icons.profile.urlschme}
                  />
                ) : null}
              </View>
            ) : null}
            {info && (info.user.github || info.user.telegram || info.user.twitter) ? (
              <View style={ProfileInfoStyle.infoItem(theme)}>
                {info?.user.github ? (
                  <TextWithIconPress
                    onPress={() => {
                      NavigationService.navigate(ROUTES.WebViewer, { url: `https://github.com/${info.user.twitter}` })
                    }}
                    containerStyle={{ marginRight: theme.spacing.small }}
                    text={info?.user.github}
                    icon={theme.assets.images.icons.profile.github}
                  />
                ) : null}
                {info?.user.telegram ? (
                  <TextWithIconPress
                    containerStyle={{ marginRight: theme.spacing.small }}
                    text={info?.user.telegram}
                    icon={theme.assets.images.icons.profile.telegram}
                  />
                ) : null}
                {info?.user.twitter ? (
                  <TextWithIconPress
                    onPress={() => {
                      NavigationService.navigate(ROUTES.WebViewer, { url: `https://twitter.com/${info.user.twitter}` })
                    }}
                    containerStyle={{ marginRight: theme.spacing.small }}
                    text={info?.user.twitter}
                    icon={theme.assets.images.icons.profile.twitter}
                  />
                ) : null}
              </View>
            ) : null}
            {info?.user.created ? (
              <Text style={[ProfileInfoStyle.infoItem(theme), theme.typography.captionText]}>
                {translate('label.joinV2exSinceTime')
                  .replace('$', info?.user.userId.toString())
                  .replace('$', dayjs(info?.user.created * 1000).format())}
              </Text>
            ) : null}
          </>
        )}
      </View>
    )
  }

  return renderContent()
}

export default ProfileInfo
