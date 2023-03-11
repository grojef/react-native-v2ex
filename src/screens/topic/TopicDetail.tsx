/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import {Input, Spinner, useToast} from '@src/components'
import {translate} from '@src/i18n'
import {TopicDetailScreenProps as ScreenProps} from '@src/navigation'
import {ITheme, SylCommon, useTheme} from '@src/theme'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {ScrollView, TextStyle, View, ViewStyle} from 'react-native'
import {SetStatusBar, TableChildren, TableList, TableRow, TopicInfo} from '../components'
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {EditTopicHeaderButton} from "@src/screens/components/button";
import {Picker} from "@react-native-picker/picker";
import {defaultDictMeta} from "@src/helper/defaultDictMeta";

const TopicDetail = ({route, navigation}: ScreenProps) => {
  const {theme} = useTheme()
  const {topicId} = route.params
  const [topic, setTopic] = useState<AppObject.Topic>();
  const {showMessage} = useToast()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: topic ? () =>
        (
          <EditTopicHeaderButton onPress={() => {
            ApiLib.topic.update(topic).then((res) => {
              showMessage("更新成功")
              navigation.goBack()
            }).catch((error) => {
              showMessage(error.msg)
            })
          }}/>
        ) : undefined
    })
  }, [navigation, topic])


  const [xFeat, setXFeat] = useState('');
  const [xSex, setXSex] = useState('');
  const [xInt, setXInt] = useState('');

  const [dictIntent, setDictIntent] = useState<AppObject.DictMeta[]>([])
  const [dictFeatures, setDictFeatures] = useState<AppObject.DictMeta[]>([])
  const [dictSex, setDictSex] = useState<AppObject.DictMeta[]>([])

  useEffect(() => {

    ApiLib.topic.topic(route.params.topicId).then(res => {
      return setTopic(res)
    }).catch((err) => {
      showMessage({text1:"温馨提示",text2: err.msg, type: 'error'})
    })

    ApiLib.dict.dict('sys_user_sex').then(res => {
      res.unshift(defaultDictMeta)
      setDictSex(res)
    })
    ApiLib.dict.dict('cms_feature').then(res => {
      res.unshift(defaultDictMeta)
      setDictFeatures(res)
    })
    ApiLib.dict.dict('call_intent_type').then(res => {
      res.unshift(defaultDictMeta)
      setDictIntent(res)
    })
  }, [topicId, navigation]);

  const findDict = (dict: AppObject.DictMeta[], dictValue: any) => {
    if (dictValue) {
      return dict ? dict.find(s => s.dictValue == dictValue)?.dictLabel : '';
    } else {
      return ''
    }
  }

  const renderContent = () => {
    if (!topic) {
      return <Spinner style={{marginTop: 50}}/>
    }

    return (
      <>
        <SetStatusBar/>
        <ScrollView>
          <TopicInfo info={topic}/>
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
            <TableChildren
              title={translate(`common.sex`)}
              leftIcon={theme.assets.images.icons.table.opensource}
              withArrow={true}
              rightText={findDict(dictSex, topic.sex)}
            >
              <Picker
                style={{position: 'absolute', width: 160, height: 0, transform: [{scaleX: 0}]}}
                selectedValue={xSex}
                onValueChange={(itemValue: string, itemIndex) => {
                  setXSex(itemValue)
                  setTopic({...topic, sex: itemValue})
                }
                }>
                {dictSex?.map(sex => {
                  return <Picker.Item key={sex.dictCode} label={sex.dictLabel}
                                      value={sex.dictValue}/>
                })}
              </Picker>
            </TableChildren>
            <TableChildren
              title={translate(`common.intentFlag`)}
              leftIcon={theme.assets.images.icons.table.score}
              withArrow={true}
              rightText={findDict(dictIntent, topic.intentFlag)}
            >
              <Picker
                style={{position: 'absolute', width: 160, height: 0, transform: [{scaleX: 0}]}}
                selectedValue={xInt}
                onValueChange={(itemValue: string, itemIndex) => {
                  setXInt(itemValue)
                  setTopic({...topic, intentFlag: itemValue})
                }
                }>
                {dictIntent?.map(intent => {
                  return <Picker.Item key={intent.dictCode} label={intent.dictLabel}
                                      value={intent.dictValue}/>
                })}
              </Picker>
            </TableChildren>

            <TableChildren
              title={translate(`common.feature`)}
              leftIcon={theme.assets.images.icons.table.theme}
              withArrow={true}
              rightText={findDict(dictFeatures, topic.feature)}
            >
              <Picker
                style={{position: 'absolute', width: '100%', height: 0, transform: [{scaleX: 0}]}}
                selectedValue={xFeat}
                onValueChange={(itemValue: string, itemIndex) => {
                  setXFeat(itemValue)
                  setTopic({...topic, feature: itemValue})
                }
                }>
                {dictFeatures?.map(fea => {
                  return <Picker.Item key={fea.dictCode} label={fea.dictLabel}
                                      value={fea.dictValue}/>
                })}
              </Picker>
            </TableChildren>

            <TableChildren
              title={translate(`common.nickName`)}
              leftIcon={theme.assets.images.icons.table.group}
              withArrow={true}
            >
              <Input
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                value={topic.nickName}
                onChangeText={(text)=>setTopic({...topic,nickName:text})}
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
              onChangeText={(text) => setTopic({...topic, remark: text})}
              inputStyle={styles.inputStyle(theme)}
              containerStyle={styles.inputContainer(theme)}
            />
          </TableList>
        </ScrollView>
      </>
    )
  }

  return <View
    style={[SylCommon.Layout.fill, SylCommon.View.background(theme)]}>{renderContent()}</View>
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
  input: (theme: ITheme): TextStyle => ({
    alignItems: 'baseline',
    height: 40, width: 200,borderWidth:0,right:8,position:"absolute", backgroundColor: 'transparent'
  }),
  inputSingle: (theme: ITheme): TextStyle => ({
      textAlign:'right',
      writingDirection:'rtl',
    ...theme.typography.captionText
  }),
  label: (theme: ITheme): TextStyle => ({
    paddingLeft: 10,
    paddingRight: 0,
    textAlign: "right",
    fontSize: 14,
    maxWidth: 60
  }),
}
export default TopicDetail
