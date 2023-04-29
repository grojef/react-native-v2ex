/**
 * Created by leon<silenceace@gmail.com> on 22/04/14.
 */
import {loginByToken} from '@src/actions'
import {Button, Input, Text, useToast} from '@src/components'
import {translate} from '@src/i18n'
import {ROUTES, SignInScreenProps as ScreenProps} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import {APP_AUTH_RESET, APP_LOGOUT, IState, ITheme} from '@src/types'
import * as utils from '@src/utils'
import React, {useEffect, useState} from 'react'
import {Image, ImageStyle, Pressable, TextStyle, View, ViewStyle} from 'react-native'
import {connect} from 'react-redux'
import {SetStatusBar} from '../components'
import {useAppDispatch} from '@src/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {ApiLib} from '@src/api'
import {MEMBER_TOKEN_KEY} from '@config/constants'
import {Verification} from '@src/screens/components/verification'

const Screen = ({
  navigation,
  loading = false,
  error,
  success,
  auth: _auth = (loginId: string, password: string, uuid: string, code: string) => {
    utils.Alert.alert({ message: 'token: ' + loginId })
  }
}: ScreenProps) => {
  const [userId, setUserId] = useState('')
  const [uuid, setUuid] = useState('')
  const [code, setCode] = useState('')
  const [pwd, setPwd] = useState('')
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { showMessage } = useToast()
  const [keyboardRaise, setKeyboardRaise] = useState(false)

  const initToken = async () => {
    const sessionUserId = await AsyncStorage.getItem('sessionUserId')
    if (sessionUserId) {
      setUserId(sessionUserId)
    }
  }

  useEffect(() => {
    initToken().then()
    dispatch({ type: APP_AUTH_RESET, payLoad: {} })
  }, [navigation])

  const goNextRoute = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.Main }]
    })
  }

  useEffect(() => {
    if (success && ApiLib.token) {
      AsyncStorage.setItem('sessionUserId', userId)
      showMessage({ type: 'success', text2: success })
      goNextRoute()
    } else {
      //防止死循环登录
      AsyncStorage.setItem(MEMBER_TOKEN_KEY, '')
      ApiLib.member.logout().then((r) => null)
      dispatch({ type: APP_LOGOUT })
    }
  }, [success]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      showMessage({ type: 'error', text2: error })
      dispatch({ type: APP_AUTH_RESET, payLoad: {} })
    }
  }, [error]) // eslint-disable-line react-hooks/exhaustive-deps

  const onLoginPress = () => {
    _auth(userId, pwd, uuid, code)
  }

  const dataChange = (uuid: string, code: string) => {
    setUuid(uuid)
    setCode(code)
  }

  const renderButtons = () => {
    return (
      <View>
        <Button
          style={styles.button(theme)}
          type="large"
          disabled={userId === '' || loading}
          onPress={onLoginPress}
          loading={loading}>
          {translate('button.loginByToken')}
        </Button>
      </View>
    )
  }

  return (
    <View
      style={[
        SylCommon.Card.container(theme),
        styles.mainContainer(theme, keyboardRaise),
        { backgroundColor: theme.colors.background }
      ]}>
      <SetStatusBar backgroundColor={theme.colors.background} />
      <View style={styles.columnItem(theme)}>
        <Image
          source={
            theme.name === 'dark' ? theme.assets.images.icons.app.arrow.light : theme.assets.images.icons.app.arrow.dark
          }
          style={styles.logo(theme)}
        />
      </View>
      <View style={styles.columnItem(theme)}>
        <Input
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          placeholder={'请输入账号'}
          keyboardType="default"
          returnKeyType="next"
          autoCorrect={false}
          value={userId}
          onFocus={() => setKeyboardRaise(true)}
          onBlur={() => setKeyboardRaise(false)}
          editable={!loading}
          onChangeText={setUserId}
          containerStyle={styles.input(theme)}
          textContentType="none"
        />
        <Input
          autoCapitalize="none"
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          placeholder={'请输入密码'}
          keyboardType="default"
          returnKeyType="next"
          autoCorrect={false}
          value={pwd}
          onFocus={() => setKeyboardRaise(true)}
          onBlur={() => setKeyboardRaise(false)}
          editable={!loading}
          onChangeText={setPwd}
          containerStyle={styles.input(theme)}
          textContentType="none"
        />
        <Verification key={error} dataChange={dataChange} />
        {renderButtons()}
      </View>
      <View style={styles.footer(theme)}>
        <Text style={styles.footerText(theme)}>{translate('label.confirmTerms')}</Text>
        <Pressable
          onPress={() => {
            navigation.navigate(ROUTES.PrivacyPolicy)
          }}>
          <Text style={[styles.footerText(theme), { color: theme.colors.secondary }]}>
            {translate('common.privacyPolicy')}
          </Text>
        </Pressable>
        <Text style={styles.footerText(theme)}>{translate('common.and')}</Text>
        <Pressable
          onPress={() => {
            navigation.navigate(ROUTES.TermsOfService)
          }}>
          <Text style={[styles.footerText(theme), { color: theme.colors.secondary }]}>
            {translate('common.termsOfService')}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

/**
 * @description styles settings
 */
const styles = {
  mainContainer: (theme: ITheme, keyboardRaise: boolean): ViewStyle => ({
    flex: 1,
    width: theme.dimens.defaultButtonWidth,
    backgroundColor: theme.colors.transparent,
    paddingTop: theme.dimens.WINDOW_HEIGHT / 60,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'center'
  }),
  columnItem: (theme: ITheme): ViewStyle => ({
    marginBottom: theme.spacing.large,
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  logo: (theme: ITheme): ImageStyle => ({
    width: 150 * 0.9,
    height: 128 * 0.9,
    alignSelf: 'center',
    marginBottom: 40
  }),
  actionContainer: (theme: ITheme): ViewStyle => ({
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }),
  input: (theme: ITheme): ViewStyle => ({
    width: '100%',
    marginBottom: theme.spacing.large
  }),
  button: (theme: ITheme): ViewStyle => ({
    width: '100%'
  }),
  linkSkip: (theme: ITheme): TextStyle => ({
    marginTop: theme.spacing.large * 3,
    color: theme.colors.bodyText,
    height: 30
  }),
  footer: (theme: ITheme): ViewStyle => ({
    width: '80%',
    marginBottom: theme.spacing.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap'
  }),
  footerText: (theme: ITheme): TextStyle => ({
    ...theme.typography.captionText,
    fontSize:14
  })
}

const mapStateToProps = ({ ui: { login } }: { ui: IState.UIState }) => {
  const { error, success, loading } = login
  return { error, success, loading }
}

export default connect(mapStateToProps, { auth: loginByToken })(Screen)
