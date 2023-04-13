/**
 * Created by leon<silenceace@gmail.com> on 22/2/21.
 */
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer, NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { ToastProvider } from '@src/components/toast'
import { useAppSelector } from '@src/hooks'
import { useUnRead } from '@src/hooks/useUnRead'
import { changeLocale, LanguageTagType, translate } from '@src/i18n'
import * as Screens from '@src/screens'
import { RootState, store } from '@src/store'
import { ITheme, useTheme } from '@src/theme'
import { wait } from '@src/utils/utils'
import dayjs from 'dayjs'
import enUS from 'dayjs/locale/en'
import zhCN from 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { ReactNode, useEffect, useState } from 'react'
import { Image, Platform, StatusBar, TextStyle, View } from 'react-native'
import { SheetProvider } from 'react-native-actions-sheet'
import { EdgeInsets, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import '../components/actions-sheet'
import NavigationService from './NavigationService'
import { RootStackParamList, ROUTES } from './routes'

/**
 * dayjs
 */
dayjs.extend(relativeTime)

/**
 * header background default style
 * @param borderWidth
 * @returns
 */
const defaultHeaderBackground = (theme: ITheme, borderWidth?: number): ReactNode => {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: theme.colors.headerBackground,
        borderBottomColor: theme.colors.border,
        borderBottomWidth: borderWidth ?? 0.3
      }}
    />
  )
}

const defaultCommonScreenOptions = (theme: ITheme) => ({
  // hide header shadow
  headerShadowVisible: false,

  headerStyle: {
    backgroundColor: theme.colors.transparent
  },
  headerBackground: () => defaultHeaderBackground(theme),
  headerTintColor: theme.colors.appbarTint,

  // screen main content style
  contentStyle: {
    backgroundColor: theme.colors.background
  }
})

const defaultScreenOptions = (theme: ITheme): NativeStackNavigationOptions => ({
  ...defaultCommonScreenOptions(theme),

  animationTypeForReplace: 'push',
  animation: 'slide_from_right',

  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: theme.typography.titleText.fontSize
  },

  headerBackTitle: undefined,
  headerBackTitleVisible: false
})

const resetLocales = (locale: LanguageTagType) => {
  changeLocale(locale)
  dayjs.locale(locale === 'zh' ? zhCN : enUS)
}

const badgeStyles = {
  badge: (theme: ITheme): TextStyle => ({
    height: theme.dimens.badgeSize,
    fontSize: theme.dimens.badgeSize - 6,
    fontWeight: 'bold',
    borderRadius: theme.dimens.badgeSize
  })
}

const bottomTabBarIconSize = 30
const renderBottomIcon = (focused: boolean, activeIcon: any, inactiveIcon: any): ReactNode => {
  const icon = focused ? activeIcon : inactiveIcon
  return <Image source={icon} style={{ width: bottomTabBarIconSize, height: bottomTabBarIconSize }} />
}

const defaultTabBarSetting = (theme: ITheme, insets: EdgeInsets): BottomTabNavigationOptions => {
  return {
    ...defaultCommonScreenOptions(theme),
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: theme.typography.titleText.fontSize
    },
    headerShown: true,
    tabBarActiveTintColor: theme.colors.tabBarIconActive,
    tabBarInactiveTintColor: theme.colors.tabBarIconInactive,
    tabBarShowLabel: false,
    tabBarItemStyle: {
      height: bottomTabBarIconSize,
      marginTop: 5
    },
    tabBarStyle: {
      backgroundColor: theme.colors.tabBarBackground,
      height: bottomTabBarIconSize + insets.bottom + 10,
      borderTopColor: theme.colors.border
    }
  }
}

const MainBottomTabNavigator = createBottomTabNavigator()
const MainAppNavigator = () => {
  const insets = useSafeAreaInsets()
  const { unread } = useUnRead()
  const { languageTag } = useAppSelector((state: RootState) => state.setting)
  const { theme } = useTheme()

  useEffect(() => {
    resetLocales(languageTag)
  }, [languageTag])

  return (
    <MainBottomTabNavigator.Navigator>
      <MainBottomTabNavigator.Screen
        name={ROUTES.Latest}
        component={Screens.LatestScreen}
        options={{
          title: translate(`router.${ROUTES.Latest}`),
          ...defaultTabBarSetting(theme, insets),
          tabBarIcon: ({ focused }) =>
            renderBottomIcon(
              focused,
              theme.assets.images.icons.bottomTab.home.active,
              theme.assets.images.icons.bottomTab.home.inActive
            )
        }}
      />
      <MainBottomTabNavigator.Screen
        name={ROUTES.Nodes}
        component={Screens.NodesScreen}
        options={{
          title: translate(`router.${ROUTES.Nodes}`),
          ...defaultTabBarSetting(theme, insets),
          tabBarIcon: ({ focused }) =>
            renderBottomIcon(
              focused,
              theme.assets.images.icons.bottomTab.like.active,
              theme.assets.images.icons.bottomTab.like.inActive
            )
        }}
      />
      <MainBottomTabNavigator.Screen
        name={ROUTES.Center}
        component={Screens.WorkCenterScreen}
        options={{
          title: translate(`router.${ROUTES.Center}`),
          ...defaultTabBarSetting(theme, insets),
          tabBarIcon: ({ focused }) =>
            renderBottomIcon(
              focused,
              theme.assets.images.icons.bottomTab.nodes.active,
              theme.assets.images.icons.bottomTab.nodes.inActive
            ),
          tabBarBadge: unread > 0 ? unread : undefined,
          tabBarBadgeStyle: badgeStyles.badge(theme)
        }}
      />
      <MainBottomTabNavigator.Screen
        name={ROUTES.My}
        component={Screens.MyScreen}
        options={{
          title: translate(`router.${ROUTES.My}`),
          ...defaultTabBarSetting(theme, insets),
          tabBarIcon: ({ focused }) =>
            renderBottomIcon(
              focused,
              theme.assets.images.icons.bottomTab.my.active,
              theme.assets.images.icons.bottomTab.my.inActive
            )
        }}
      />
    </MainBottomTabNavigator.Navigator>
  )
}

const StackNavigator = createNativeStackNavigator<RootStackParamList>()

export const AppNavigationContainer = () => {
  const { token } = useAppSelector((state: RootState) => state.member)
  const {
    login: { tokenGeneratedLink }
  } = useAppSelector((state: RootState) => state.ui)
  const { languageTag } = useAppSelector((state: RootState) => state.setting)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  if (!mounted) {
    resetLocales((store.getState() as any).setting.languageTag)
  }

  useEffect(() => {
    setMounted(true)
    wait(1000, () => {
      SplashScreen.hide()
    })
  }, [])

  useEffect(() => {
    resetLocales(languageTag)
  }, [languageTag])

  return (
    <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
      <ToastProvider>
        <SheetProvider>
          <NavigationContainer
            ref={(navigatorRef: NavigationContainerRefWithCurrent<RootStackParamList>) => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}
            theme={{
              dark: theme.name === 'dark',
              colors: {
                ...DefaultTheme.colors,
                background: theme.colors.background
              }
            }}
            documentTitle={{
              formatter: (options, route) => `${options?.title ?? route?.name}`
            }}>
            <StatusBar
              backgroundColor={
                Platform.OS === 'ios'
                  ? 'default'
                  : theme.name === 'dark'
                  ? theme.colors.primaryDark
                  : theme.colors.primary
              }
              barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
            />
            <StackNavigator.Navigator initialRouteName={!token ? ROUTES.Main : ROUTES.Main}>
              <StackNavigator.Screen
                name={ROUTES.SignIn}
                component={Screens.SignInScreen}
                options={{
                  ...defaultScreenOptions,
                  headerBackground: () => null,
                  title: translate(`router.${ROUTES.SignIn}`),
                  headerTitleStyle: { color: theme.colors.transparent },
                  headerBackTitleVisible: false,
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Main}
                component={MainAppNavigator}
                options={({ route, navigation }) => ({
                  ...defaultScreenOptions(theme),
                  headerBackground: undefined,
                  headerShown: false
                })}
                initialParams={{
                  initialRouteName: ROUTES.My
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.NodeTopics}
                component={Screens.NodeTopicListScreen}
                options={{
                  title: translate(`router.${ROUTES.NodeTopics}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.TopicDetail}
                component={Screens.TopicDetailScreen}
                options={{
                  title: translate(`router.${ROUTES.TopicDetail}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.TopicEdit}
                component={Screens.TopicEditScreen}
                options={{
                  title: translate(`router.${ROUTES.TopicEdit}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Profile}
                component={Screens.ProfileScreen}
                options={{
                  title: translate(`router.${ROUTES.Profile}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.NotificationInfo}
                component={Screens.NotificationInfoScreen}
                options={{
                  title: translate(`router.${ROUTES.NotificationInfo}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.VisitInfoList}
                component={Screens.VisitInfoListScreen}
                options={{
                  title: translate(`router.${ROUTES.VisitInfoList}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.VisitInfo}
                component={Screens.VisitInfoScreen}
                options={{
                  title: translate(`router.${ROUTES.VisitInfo}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Notifications}
                component={Screens.NotificationsScreen}
                options={{
                  title: translate(`router.${ROUTES.Notifications}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Following}
                component={Screens.FollowingScreen}
                options={{
                  title: translate(`router.${ROUTES.Following}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.FavoriteTopics}
                component={Screens.FavoriteTopicsScreen}
                options={{
                  title: translate(`router.${ROUTES.FavoriteTopics}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.MyTopics}
                component={Screens.MyTopics}
                options={{
                  title: translate(`router.${ROUTES.MyTopics}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Setting}
                component={Screens.SettingScreen}
                options={{
                  title: translate(`router.${ROUTES.Setting}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Language}
                component={Screens.LanguageScreen}
                options={{
                  title: translate(`router.${ROUTES.Language}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.About}
                component={Screens.AboutScreen}
                options={{
                  title: translate(`router.${ROUTES.About}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Feedback}
                component={Screens.FeedbackScreen}
                options={{
                  title: translate(`router.${ROUTES.Feedback}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.ThemeSetting}
                component={Screens.ThemeScreen}
                options={{
                  title: translate(`router.${ROUTES.ThemeSetting}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.URLSchemes}
                component={Screens.URLSchemesScreen}
                options={{
                  title: translate(`router.${ROUTES.URLSchemes}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.CacheSetting}
                component={Screens.CacheSettingScreen}
                options={{
                  title: translate(`router.${ROUTES.CacheSetting}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.ChangeLog}
                component={Screens.ChangeLogScreen}
                options={{
                  title: translate(`router.${ROUTES.ChangeLog}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.HowToUse}
                component={Screens.HowToUseScreen}
                options={{
                  title: translate(`router.${ROUTES.HowToUse}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.PrivacyPolicy}
                component={Screens.PrivacyScreen}
                options={{
                  title: translate(`router.${ROUTES.PrivacyPolicy}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.TermsOfService}
                component={Screens.TermsOfServiceScreen}
                options={{
                  title: translate(`router.${ROUTES.TermsOfService}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.SiteStat}
                component={Screens.SiteStatScreen}
                options={{
                  title: translate(`router.${ROUTES.SiteStat}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.OpenSourceLicense}
                component={Screens.OpenSourceScreen}
                options={{
                  title: translate(`router.${ROUTES.OpenSourceLicense}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.Search}
                component={Screens.SearchScreen}
                options={{
                  title: translate(`router.${ROUTES.Search}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.History}
                component={Screens.HistoryScreen}
                options={{
                  title: translate(`router.${ROUTES.History}`),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                }}
              />
              <StackNavigator.Screen
                name={ROUTES.WebViewer}
                component={Screens.WebLinkScreen}
                options={({ route }) => ({
                  title: route?.params?.title ?? translate('brand.name'),
                  ...defaultScreenOptions(theme),
                  headerShown: true
                })}
              />
            </StackNavigator.Navigator>
          </NavigationContainer>
        </SheetProvider>
      </ToastProvider>
    </SafeAreaProvider>
  )
}
