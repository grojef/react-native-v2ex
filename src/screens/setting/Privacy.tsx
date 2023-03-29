import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle } from 'react-native'
import { SylCommon, useTheme } from '@src/theme'
import { IState, ITheme } from '@src/types'
import { Text } from '@src/components'
import { PrivacyPolicyScreenProps as ScreenProps } from '@src/navigation/routes'

const Privacy = ({ route, navigation, loading }: ScreenProps) => {
  const { theme } = useTheme()
  return (
    <View style={SylCommon.Layout.fill}>
      <Text style={{ fontWeight: 'bold' }}>隐私政策</Text>
      <Text>感谢您使用我们的应用程序。本隐私政策旨在向您说明我们收集、使用和保护您的个人信息的方式。</Text>
      <Text style={{ fontWeight: 'bold' }}>我们的应用程序收集的信息:</Text>
      <Text>
        1.用户提供的信息：您可以在使用我们的应用程序时，通过我们的联系方式提供您的姓名、电子邮件地址和电话号码等联系信息，以便我们提供相关支持服务。
      </Text>
      <Text>2.设备信息：我们的应用程序可能会收集您的设备信息，例如设备类型、操作系统版本和应用程序版本。</Text>
      <Text>3.应用程序使用信息：我们的应用程序可能会记录您使用应用程序的方式，例如您访问的页面和使用的功能。</Text>
      <Text>4.位置信息：我们的应用程序不会收集您的位置信息。</Text>
      <Text style={{ fontWeight: 'bold' }}>我们如何使用这些信息：</Text>
      <Text>
        我们使用您提供的联系信息来向您提供支持服务，例如回答您的问题或解决您的问题。我们使用设备信息和应用程序使用信息来改进我们的应用程序，并为您提供更好的用户体验。
      </Text>
      <Text>我们不会收集或存储您的通讯录信息，我们承诺不会泄露或出售您的个人信息给第三方。</Text>
      <Text style={{ fontWeight: 'bold' }}>安全性：</Text>
      <Text>
        我们会采取合理的措施来保护您的个人信息免遭丢失、滥用或篡改。我们使用安全套接字层（SSL）技术来加密通过我们的应用程序发送的所有数据。
      </Text>
      <Text style={{ fontWeight: 'bold' }}>联系我们：</Text>
      <Text>如果您对我们的隐私政策或我们如何处理您的个人信息有任何问题，请随时联系我们。</Text>
      <Text>谢谢您使用我们的应用程序！</Text>
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

export default connect(mapStateToProps)(Privacy)
