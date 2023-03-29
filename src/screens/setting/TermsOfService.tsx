import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle } from 'react-native'
import { SylCommon, useTheme } from '@src/theme'
import { IState, ITheme } from '@src/types'
import { Text } from '@src/components'
import { TermsOfServiceScreenProps as ScreenProps } from '@src/navigation/routes'

const TermsOfServiceScreen = ({ route, navigation, loading }: ScreenProps) => {
  const { theme } = useTheme()
  return (
    <View style={SylCommon.Layout.fill}>
      <Text>免责声明</Text>

      <Text>
        欢迎使用我们的OA办公软件！在使用我们的OA办公软件之前，请务必仔细阅读并理解本免责声明中列出的条款和条件。
      </Text>

      <Text>1.本软件仅供合法目的使用，禁止用户将该软件用于任何违法行为。用户必须遵守所有适用的法律和法规。</Text>

      <Text>2.我们不对因使用该软件而发生的任何问题或损失负责，包括但不限于软件中断、质量问题或其他技术问题。</Text>

      <Text>
        3.我们不对因使用该软件而导致的任何损失或损害负责，包括但不限于因使用软件的方式而导致的任何直接、间接、特殊、偶发、相应的、惩罚性或其他损失或损害。
      </Text>

      <Text>4.用户必须自行承担使用该软件所带来的风险和责任，包括但不限于任何与使用该软件相关的风险或责任。</Text>

      <Text>
        5.我们保留随时更改该免责声明的权利，我们将在本页面上发布任何更新的版本。用户应定期查看本免责声明以了解最新更新。
      </Text>

      <Text>
        通过使用该软件，用户表示已经阅读并同意本免责声明中的所有条款和条件。如果用户不同意本免责声明中的任何条款和条件，则不得使用该软件。请注意，该软件不能用于任何违法行为。
      </Text>
    </View>
  )
}

/**
 * @description styles settings
 */
const styles = {
  container: (theme: ITheme): ViewStyle => ({
    flex: 1
  })
}

const mapStateToProps = ({ ui: { login } }: { ui: IState.UIState }) => {
  const { error, success, loading } = login
  return { error, success, loading }
}

export default connect(mapStateToProps)(TermsOfServiceScreen)
