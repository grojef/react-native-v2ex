/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import { Input, Spinner } from '@src/components'
import { translate } from '@src/i18n'
import { TopicDetailScreenProps as ScreenProps } from '@src/navigation'
import { ITheme, SylCommon, useTheme } from '@src/theme'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { SetStatusBar, TableChildren, TableList, TableRow } from '../components'
import { ApiLib } from '@src/api'
import { AppObject } from '@src/api/types'
import { Picker } from '@react-native-picker/picker'
import { EditTopicHeaderButton } from '@src/screens/components/button'

const TopicEdit = ({ route, navigation }: ScreenProps) => {
  const { theme } = useTheme()
  const { topicId } = route.params
  const [topic, setTopic] = useState<AppObject.Topic>()
  const [keyboardRaise, setKeyboardRaise] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    ApiLib.topic
      .topic(topicId)
      .then((res) => {
        return setTopic(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [topicId, navigation])

  const [dictIntent, setDictIntent] = useState<AppObject.DictMeta[]>([])
  const [dictFeatures, setDictFeatures] = useState<AppObject.DictMeta[]>([])
  const [dictSex, setDictSex] = useState<AppObject.DictMeta[]>([])

  useEffect(() => {
    ApiLib.dict.dict('sys_user_sex').then((res) => {
      setDictSex(res)
    })
    ApiLib.dict.dict('cms_feature').then((res) => {
      setDictFeatures(res)
    })
    ApiLib.dict.dict('call_intent_type').then((res) => {
      setDictIntent(res)
    })
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <EditTopicHeaderButton
          onPress={() => {
            ApiLib.topic.update(topic).then()
          }}
        />
      )
    })
  }, [navigation])

  const findDict = (dict: AppObject.DictMeta[], dictValue: any) => {
    if (dictValue) {
      return dict ? dict.find((s) => s.dictValue == dictValue)?.dictLabel : ''
    } else {
      return ''
    }
  }

  const reanderContent = () => {
    if (!topic) {
      return <Spinner style={{ marginTop: 50 }} />
    }

    // @ts-ignore
    return (
      <>
        <SetStatusBar />

        <ScrollView>
          <TableList title={translate('common.customerInfo')}>
            <TableRow
              title={translate(`common.phone`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={false}
              rightText={`${topic.phoneNumber}`}
            />
            <TableRow
              title={translate(`common.nickName`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
              rightText={`${topic.nickName ? topic.nickName : ''}`}
            />
            <TableChildren
              title={translate(`common.sex`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
              rightText={findDict(dictSex, topic.sex)}>
              <Picker
                style={{ position: 'absolute', width: 160, height: 0, transform: [{ scaleX: 0 }] }}
                onValueChange={(itemValue: string, itemIndex) => {
                  setTopic({ ...topic, sex: itemValue })
                }}>
                {dictSex?.map((sex) => {
                  return <Picker.Item key={sex.dictCode} label={sex.dictLabel} value={sex.dictValue} />
                })}
              </Picker>
            </TableChildren>
            <TableChildren
              title={translate(`common.intentFlag`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
              rightText={findDict(dictIntent, topic.intentFlag)}>
              <Picker
                style={{ position: 'absolute', width: 160, height: 0, transform: [{ scaleX: 0 }] }}
                onValueChange={(itemValue: string, itemIndex) => {
                  setTopic({ ...topic, intentFlag: itemValue })
                }}>
                {dictIntent?.map((sex) => {
                  return <Picker.Item key={sex.dictCode} label={sex.dictLabel} value={sex.dictValue} />
                })}
              </Picker>
            </TableChildren>

            <TableChildren
              title={translate(`common.feature`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={true}
              rightText={findDict(dictFeatures, topic.feature)}>
              <Picker
                style={{ position: 'absolute', width: 160, height: 0, transform: [{ scaleX: 0 }] }}
                onValueChange={(itemValue: string, itemIndex) => {
                  setTopic({ ...topic, feature: itemValue })
                }}>
                {dictFeatures?.map((sex) => {
                  return <Picker.Item key={sex.dictCode} label={sex.dictLabel} value={sex.dictValue} />
                })}
              </Picker>
            </TableChildren>
            <Input
              labelStyle={styles.label(theme)}
              multiline={true}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              placeholder={'请输入备注内容'}
              keyboardType="default"
              returnKeyType="next"
              autoCorrect={false}
              value={token}
              onFocus={() => setKeyboardRaise(true)}
              onBlur={() => setKeyboardRaise(false)}
              editable={true}
              onChangeText={setToken}
              inputStyle={styles.inputStyle(theme)}
              containerStyle={styles.inputContainer(theme)}
            />
          </TableList>
        </ScrollView>
      </>
    )
  }

  return <View style={[SylCommon.Layout.fill, SylCommon.View.background(theme)]}>{reanderContent()}</View>
}

const styles = {
  inputContainer: (theme: ITheme): ViewStyle => ({
    width: '100%',
    borderBottomWidth: 1,
    height: 100,
    alignItems: 'center'
  }),
  inputStyle: (theme: ITheme): ViewStyle => ({
    width: '100%',
    height: 100,
    alignItems: 'baseline'
  }),
  label: (theme: ITheme): TextStyle => ({
    paddingLeft: 10,
    paddingRight: 0,
    textAlign: 'right',
    fontSize: 14,
    maxWidth: 60
  })
}
export default TopicEdit
