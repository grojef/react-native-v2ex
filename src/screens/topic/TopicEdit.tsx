/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import {Input, Placeholder, Spinner, Text} from '@src/components'
import {translate} from '@src/i18n'
import {ROUTES, TopicDetailScreenProps as ScreenProps} from '@src/navigation'
import {ITheme, SylCommon, useTheme} from '@src/theme'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Linking, ScrollView, TextStyle, View, ViewStyle} from 'react-native'
import {SetStatusBar, TableList, TableRow, TopicInfo} from '../components'
import {useDict} from "@src/hooks/useDict";
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {cacheDict} from "@src/actions";
import {LogoutHeaderButton} from "@src/screens/components/button";

const TopicEdit = ({route, navigation}: ScreenProps) => {
  const {theme} = useTheme()
  const [dict, setDict] = useState<Map<string, Array<AppObject.DictMeta>>>(new Map);
  const {topicId} = route.params
  const [topic, setTopic] = useState<AppObject.Topic>();
  const [keyboardRaise, setKeyboardRaise] = useState(false)
  const [token, setToken] = useState('')
  useEffect(() => {
    ApiLib.topic.topic(route.params.topicId).then(res => {
      return setTopic(res)
    }).catch((err) => {
      console.error(err)
    })

  }, [topicId, navigation])


  const findDict = (dictType: any, dictValue: any) => {
    // @ts-ignore
    if (dictValue) {
      return dict ? dict.get(dictType)?.find(s => s.dictValue == dictValue)?.dictLabel : '';
    } else {
      return ''
    }
  }

  const reanderContent = () => {
    if (!topic) {
      return <Spinner style={{marginTop: 50}}/>
    }

    return (
      <>
        <SetStatusBar/>
        <ScrollView>
          <TableList title={translate('common.customerInfo')}>
            <TableRow
                      title={translate(`common.phone`)}
                      leftIcon={theme.assets.images.icons.table.email}
                      withArrow={true}
                      rightText={`${topic.phoneNumber}`}
            />
            <TableRow
              title={translate(`common.nickName`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
              rightText={`${topic.niceName ? topic.niceName : ''}`}
            />
            <TableRow
              title={translate(`common.sex`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
              rightText={`${findDict('sys_user_sex', topic.sex)}`}
            />
            <TableRow
              title={translate(`common.intentFlag`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
              rightText={`${findDict('call_intent_type', topic.intentFlag)}`}
            />
            <TableRow
              title={translate(`common.feature`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={true}
              rightText={`${findDict('cms_feature', topic.feature)}`}
            />
            <Input
              label={'备注:'}
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

  return <View
    style={[SylCommon.Layout.fill, SylCommon.View.background(theme)]}>{reanderContent()}</View>
}

const styles = {
  inputContainer: (theme: ITheme): ViewStyle => ({
    width: '100%',
    borderBottomWidth:1,
    height:100,
    alignItems: 'center'
  }),
  inputStyle:(theme: ITheme): ViewStyle => ({
    width: '100%',
    height:100,
    alignItems: 'baseline'
  }),
  label: (theme: ITheme): TextStyle => ({
    paddingLeft:10,
    paddingRight:0,
    textAlign:"right",
    maxWidth:60
  }),
}
export default TopicEdit
