import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

import { useTheme, SylCommon } from '@src/theme'
import { WebViewerScreenProps as ScreenProps } from '@src/navigation/routes'
import { Spinner } from '@src/components'
import { HeaderButton } from '../components'
import { linking } from '@src/utils'
import { translate } from '@src/i18n'

const WebLink = ({ route, navigation }: ScreenProps) => {
  const { theme } = useTheme()
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    navigation.setOptions({ title: translate('placeholder.loading') })
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          source={theme.assets.images.icons.header.link}
          onPress={() => {
            linking(route.params.url)
          }}
        />
      )
    })
  }, [navigation])

  return (
    <View style={[SylCommon.Layout.fill, SylCommon.View.background(theme)]}>
      {loading && <Spinner style={{ height: '100%', marginTop: '50%', marginBottom: 10000 }} />}
      <WebView
        originWhitelist={['*']}
        source={{ uri: route.params.url }}
        onLoad={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          setLoading(false)
          console.warn('WebView error: ', nativeEvent)
        }}
        onLoadEnd={(syntheticEvent) => {
          // update component to be aware of loading status
          const { nativeEvent } = syntheticEvent
          setLoading(false)

          navigation.setOptions({
            title: !route.params.title ? nativeEvent.title : route.params.title
          })
        }}
      />
    </View>
  )
}

export default WebLink
