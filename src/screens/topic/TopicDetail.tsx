/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import {Spinner} from '@src/components'
import {translate} from '@src/i18n'
import {ROUTES, TopicDetailScreenProps as ScreenProps} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import React, {useEffect, useState} from 'react'
import {Linking, ScrollView, View} from 'react-native'
import {SetStatusBar, TableList, TableRow, TopicInfo} from '../components'
import {useDict} from "@src/hooks/useDict";
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";

const TopicDetail = ({route, navigation}: ScreenProps) => {
  const {theme} = useTheme()
  const {dict} = useDict()
  const {topicId} = route.params
  const [topic, setTopic] = useState<AppObject.Topic>();
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
          <TopicInfo info={topic}/>
          <TableList title={translate('common.customerInfo')}>
            <TableRow
              title={translate(`common.createTime`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={false}
              rightText={`${topic.createTime}`}
            />
            <TableRow
              title={translate(`common.createBy`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={false}
              rightText={`${topic.createBy}`}
            />
            <TableRow onPress={() => {
              Linking.canOpenURL(`tel:${topic.phoneNumber}`).then((supported) => {
                if (!supported) {
                } else {
                  Linking.openURL(`tel:${topic.phoneNumber}`).then(() => {
                    ApiLib.topic.call(topic.id)
                  })
                }
              }).catch()
            }}
                      title={translate(`common.phone`)}
                      leftIcon={theme.assets.images.icons.table.email}
                      withArrow={false}
                      rightText={`${topic.phoneNumber}`}
            />
            <TableRow
              title={translate(`common.nickName`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={false}
              rightText={`${topic.niceName ? topic.niceName : ''}`}
            />
            <TableRow
              title={translate(`common.sex`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={false}
              rightText={`${findDict('sys_user_sex', topic.sex)}`}
            />
            <TableRow
              title={translate(`common.intentFlag`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={false}
              rightText={`${findDict('call_intent_type', topic.intentFlag)}`}
            />
            <TableRow
              title={translate(`common.feature`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={false}
              rightText={`${findDict('cms_feature', topic.feature)}`}
            />
          </TableList>
        </ScrollView>
      </>
    )
  }

  return <View
    style={[SylCommon.Layout.fill, SylCommon.View.background(theme)]}>{reanderContent()}</View>
}

export default TopicDetail
