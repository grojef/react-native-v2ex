import {logout as logoutAction} from '@src/actions'
import {useToast} from '@src/components/toast'
import {translate} from '@src/i18n'
import {MyScreenProps as ScreenProps, NavigationService, ROUTES} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import {AppObject, IState} from '@src/types'
import React, {useEffect} from 'react'
import {ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {Footer, HeaderButton, ProfileCard, SetStatusBar, TableList, TableRow} from '../components'

const My = ({
  navigation,
  app,
  profile,
  topics,
  likeTopics,
  followPeoples,
  readedTopics
}: ScreenProps &
  IState.State & {
    profile?: AppObject.Member
    token?: AppObject.MemberToken
    readedTopics?: AppObject.Topic[]
    topics?: AppObject.Topic[]
    likeTopics: AppObject.Topic[]
    followPeoples: AppObject.Member[]
    logout: () => void
  }) => {
  const { theme } = useTheme()
  const { showMessage } = useToast()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton  source={theme.assets.images.icons.bottomTab.notifications.inActive}
                      containerStyle={[{marginRight: theme.dimens.layoutContainerHorizontalMargin}]}
                       onPress={()=>{
                         NavigationService.navigate(ROUTES.Notifications)
                       }}
        />
      )
    })
  }, []);


  return (
    <ScrollView
      overScrollMode={'never'}
      bounces={false}
      style={[SylCommon.Layout.fill, { backgroundColor: theme.colors.background }]}>
      <SetStatusBar />
      <ProfileCard
        info={{
          styleType: 'simple',
          withArrow: true,
          info: profile
        }}
        stat={{
          favorites: (likeTopics && likeTopics.length) || 0,
          topics: (topics && topics?.length) || 0,
          history: (readedTopics && readedTopics?.length) || 0,
          following: (followPeoples && followPeoples.length) || 0
        }}
      />
      <TableList title={translate('common.personal')}>
        <TableRow
          title={translate(`common.role`)}
          leftIcon={theme.assets.images.icons.table.urlschme}
          withArrow={false}
          rightText={`@${profile?.user.userType}`}
        />
        <TableRow
          title={translate(`common.dept`)}
          leftIcon={theme.assets.images.icons.table.urlschme}
          withArrow={false}
          rightText={`${profile?.user.dept.deptName}`}
        />
        <TableRow
          title={translate(`common.phone`)}
          leftIcon={theme.assets.images.icons.table.email}
          withArrow={false}
          rightText={`${profile?.user.phonenumber}`}
        />
        <TableRow
          title={translate(`common.email`)}
          leftIcon={theme.assets.images.icons.table.email}
          withArrow={false}
          rightText={`${profile?.user.email}`}
        />
        <TableRow
          title={translate(`common.createTime`)}
          leftIcon={theme.assets.images.icons.table.urlschme}
          withArrow={false}
          rightText={`${profile?.user.createTime}`}
        />
      </TableList>
      <Footer />
    </ScrollView>
  )
}

const mapStateToProps = ({ member, setting, app }: IState.State) => {
  const { profile, token, readedTopics, topics, likeTopics, followPeoples } = member
  return {
    profile,
    topics,
    token,
    likeTopics,
    followPeoples,
    readedTopics,
    setting,
    app
  }
}

export default connect(mapStateToProps, {
  logout: logoutAction
})(My)
