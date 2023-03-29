/**
 * Created by leon<silenceace@gmail.com> on 22/03/4.
 */
import { logout as actionLogout } from '@src/actions'
import { Spinner } from '@src/components'
import { useMember } from '@src/hooks/useMember'
import { translate } from '@src/i18n'
import { ProfileScreenProps as ScreenProps, ROUTES } from '@src/navigation'
import { SylCommon, useTheme } from '@src/theme'
import { AppObject, IState } from '@src/types'
import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { ProfileDetail, TableList, TableRow } from '../components'
import { LogoutHeaderButton } from '../components/button'

const Profile = ({
  route,
  navigation,
  authMember,
  logout
}: ScreenProps & {
  authMember?: AppObject.Member
  logout: () => void
}) => {
  const { theme } = useTheme()
  const username = useMemo(() => route.params.userName, [route])
  const { member } = useMember({ userName: username })
  useEffect(() => {
    navigation.setOptions({ title: authMember?.user.userName })
  }, [username, member])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: authMember ? () => <LogoutHeaderButton member={authMember} /> : undefined
    })
  }, [navigation, authMember])

  const renderProfile = (user: AppObject.User) => {
    return (
      <TableList title={translate('common.setting')}>
        <TableRow
          title={translate(`router.${ROUTES.ThemeSetting}`)}
          leftIcon={theme.assets.images.icons.table.theme}
          withArrow={false}
          onPress={() => {
            // navigation.navigate(ROUTES.ThemeSetting)
          }}
        />
        <TableRow
          title={translate(`router.${ROUTES.Language}`)}
          leftIcon={theme.assets.images.icons.table.language}
          withArrow={false}
          onPress={() => {
            //navigation.navigate(ROUTES.Language)
          }}
        />
        <TableRow
          title={translate(`router.${ROUTES.CacheSetting}`)}
          leftIcon={theme.assets.images.icons.table.cached}
          withArrow={false}
          onPress={() => {
            navigation.navigate(ROUTES.CacheSetting)
          }}
        />
      </TableList>
    )
  }

  return (
    <ScrollView style={SylCommon.Layout.fill}>
      {authMember ? (
        <>
          <ProfileDetail profile={authMember} />
          {renderProfile(authMember.user)}
        </>
      ) : (
        <Spinner style={{ height: theme.dimens.WINDOW_HEIGHT }} text={translate('placeholder.loading')} />
      )}
    </ScrollView>
  )
}

const mapStateToProps = ({ member }: { member: IState.MemberState }) => {
  const { profile: authMember } = member
  return { authMember }
}

export default connect(mapStateToProps, {
  logout: actionLogout
})(Profile)
