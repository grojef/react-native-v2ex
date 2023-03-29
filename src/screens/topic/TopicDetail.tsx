/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import { Input, Spinner, useToast } from '@src/components'
import { translate } from '@src/i18n'
import { TopicDetailScreenProps as ScreenProps } from '@src/navigation'
import { ITheme, SylCommon, useTheme } from '@src/theme'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { SetStatusBar, TableChildren, TableList, TableRow, TopicInfo } from '../components'
import { ApiLib } from '@src/api'
import { AppObject } from '@src/api/types'
import { EditTopicHeaderButton } from '@src/screens/components/button'
import Picker from '@ant-design/react-native/lib/picker'

const TopicDetail = ({ route, navigation }: ScreenProps) => {
  const { theme } = useTheme()
  const { topicId } = route.params
  const [topic, setTopic] = useState<AppObject.Topic>()
  const { showMessage } = useToast()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: topic
        ? () => (
            <EditTopicHeaderButton
              onPress={() => {
                ApiLib.topic
                  .update(topic)
                  .then((res) => {
                    showMessage('更新成功')
                    navigation.goBack()
                  })
                  .catch((error) => {
                    showMessage(error.msg)
                  })
              }}
            />
          )
        : undefined
    })
  }, [navigation, topic])

  const [xFeat, setXFeat] = useState<Array<string>>([])
  const [xSex, setXSex] = useState<Array<string>>([])
  const [xInt, setXInt] = useState<Array<string>>([])

  const [dictIntent, setDictIntent] = useState<AppObject.DictMeta[]>([])
  const [dictFeatures, setDictFeatures] = useState<AppObject.DictMeta[]>([])
  const [dictSex, setDictSex] = useState<AppObject.DictMeta[]>([])

  useEffect(() => {
    ApiLib.topic
      .topic(route.params.topicId)
      .then((res) => {
        setXFeat(['' + res.feature])
        setXSex(['' + res.sex])
        setXInt(['' + res.intentFlag])
        return setTopic(res)
      })
      .catch((err) => {
        showMessage({ text1: '温馨提示', text2: err.msg, type: 'error' })
      })

    ApiLib.dict.dict('sys_user_sex').then((res) => {
      setDictSex(pathDict(res))
    })
    ApiLib.dict.dict('cms_feature').then((res) => {
      setDictFeatures(pathDict(res))
    })
    ApiLib.dict.dict('call_intent_type').then((res) => {
      setDictIntent(pathDict(res))
    })
  }, [topicId, navigation])

  const pathDict = (res: AppObject.DictMeta[]) => {
    res.forEach((s) => {
      s.label = s.dictLabel
      s.value = s.dictValue
    })
    return res
  }

  const renderContent = () => {
    if (!topic) {
      return <Spinner style={{ marginTop: 50 }} />
    }

    return (
      <>
        <SetStatusBar />
        <ScrollView>
          <TopicInfo info={topic} />
          <TableList title={translate('common.customerInfo')}>
            <TableRow
              title={translate(`common.createTime`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={false}
              rightText={`${topic.createTime}`}
            />
            <TableRow
              title={translate(`common.phone`)}
              leftIcon={theme.assets.images.icons.topic.talk}
              withArrow={false}
              rightText={`${topic.phoneNumber}`}
            />
            <Picker
              title="选择性别"
              data={dictSex}
              cols={1}
              value={[...xSex]}
              onChange={(v: any) => {
                setXSex(v)
                setTopic({ ...topic, sex: v })
              }}
              onOk={(v: any) => {
                setXSex(v)
                setTopic({ ...topic, sex: v })
              }}>
              <TableRow
                title={translate(`common.sex`)}
                leftIcon={theme.assets.images.icons.table.score}
                withArrow={true}
              />
            </Picker>
            <Picker
              title="选择意愿"
              data={dictIntent}
              cols={1}
              value={[...xInt]}
              onChange={(v: any) => {
                setXInt(v)
                setTopic({ ...topic, intentFlag: v })
              }}
              onOk={(v: any) => {
                setXInt(v)
                setTopic({ ...topic, intentFlag: v })
              }}>
              <TableRow
                title={translate(`common.intentFlag`)}
                leftIcon={theme.assets.images.icons.table.email}
                withArrow={true}
              />
            </Picker>
            <Picker
              title="选择属性"
              data={dictFeatures}
              cols={1}
              value={[...xFeat]}
              onChange={(v: any) => {
                setXFeat(v)
                setTopic({ ...topic, feature: v })
              }}
              onOk={(v: any) => {
                setXFeat(v)
                setTopic({ ...topic, feature: v })
              }}>
              <TableRow
                title={translate(`common.feature`)}
                leftIcon={theme.assets.images.icons.table.urlschme}
                withArrow={true}
              />
            </Picker>
            <TableChildren
              title={translate(`common.nickName`)}
              leftIcon={theme.assets.images.icons.table.group}
              withArrow={true}>
              <Input
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                value={topic.nickName}
                onChangeText={(text) => setTopic({ ...topic, nickName: text })}
                containerStyle={styles.input(theme)}
                textContentType="none"
                inputStyle={styles.inputSingle(theme)}
              />
            </TableChildren>
            <Input
              labelStyle={styles.label(theme)}
              multiline={true}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              placeholder={'请简短描述下客户备注'}
              keyboardType="default"
              returnKeyType="next"
              autoCorrect={false}
              value={topic.remark}
              editable={true}
              onChangeText={(text) => setTopic({ ...topic, remark: text })}
              inputStyle={styles.inputStyle(theme)}
              containerStyle={styles.inputContainer(theme)}
            />
          </TableList>
        </ScrollView>
      </>
    )
  }

  return <View style={[SylCommon.Layout.fill, SylCommon.View.background(theme)]}>{renderContent()}</View>
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
    alignItems: 'center'
  }),
  input: (theme: ITheme): TextStyle => ({
    alignItems: 'center',
    width: 200,
    borderWidth: 0,
    marginRight: -8,
    backgroundColor: 'transparent'
  }),
  inputSingle: (theme: ITheme): TextStyle => ({
    textAlign: 'right',
    writingDirection: 'ltr',
    ...theme.typography.captionText
  }),
  label: (theme: ITheme): TextStyle => ({
    paddingLeft: 10,
    paddingRight: 0,
    textAlign: 'right',
    fontSize: 14,
    maxWidth: 60
  })
}
export default TopicDetail
