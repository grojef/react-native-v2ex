/**
 * Created by leon<silenceace@gmail.com> on 22/04/28.
 */
import {Input, Spinner, useToast} from '@src/components'
import {translate} from '@src/i18n'
import {VisitInfoScreenProps as ScreenProps} from '@src/navigation'
import {ITheme, SylCommon, useTheme} from '@src/theme'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Platform, ScrollView, TextStyle, View, ViewStyle} from 'react-native'
import {SetStatusBar, TableChildren, TableList, TableRow} from '../components'
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {EditTopicHeaderButton} from "@src/screens/components/button";
import {Picker} from "@react-native-picker/picker";
import {defaultDictMeta} from "@src/helper/defaultDictMeta";
import dayjs from "dayjs";
import {Picker as IosPicker} from "@ant-design/react-native";

const VisitInfo = ({route, navigation}: ScreenProps) => {
  const {theme} = useTheme()
  const {visitId} = route.params
  // @ts-ignore
  const [visitInfo, setVisitInfo] = useState<AppObject.VisitInfo>({});
  const {showMessage} = useToast()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: visitInfo ? () =>
        (
          <EditTopicHeaderButton onPress={() => {
            if (visitInfo.id == '') {
              ApiLib.visit.save(visitInfo).then((res) => {
                showMessage("更新成功")
                navigation.goBack()
              }).catch((error) => {
                showMessage(error.msg)
              })
            } else {
              ApiLib.visit.add(visitInfo).then((res) => {
                showMessage("保存成功")
                navigation.goBack()
              }).catch((error) => {
                showMessage(error.msg)
              })
            }
          }}/>
        ) : undefined
    })
  }, [navigation, visitInfo])

  const [dictAddress, setDictAddress] = useState<AppObject.DictMeta[]>([])

  const [dictRefund, setDictRefund] = useState<AppObject.DictMeta[]>([])


  const [xAdr, setXAdr] = useState('');


  const [xFund, setXFund] = useState('');

  useEffect(() => {
    if (visitId) {
      ApiLib.visit.info(route.params.visitId).then(res => {
        return setVisitInfo(res)
      }).catch((err) => {
      })
    } else {
      setVisitInfo({
        address: "",
        createBy: "",
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        deptId: 0,
        id: undefined,
        remark: "",
        userId: 0,
        userName: "",
        visitTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        visitType1: "",
        visitType2: 0,
        visitType3: 0,
        visitor: ""
      })
    }

    ApiLib.dict.dict('oa_address').then(res => {
      res.unshift(defaultDictMeta)
      setDictAddress(pathDict(res))
    })
    ApiLib.dict.dict('oa_visit_type1').then(res => {
      res.unshift(defaultDictMeta)
      setDictRefund(pathDict(res))
    })
  }, [visitId, navigation]);

  const findDict = (dict: AppObject.DictMeta[], dictValue: any) => {
    if (dictValue) {
      return dict ? dict.find(s => s.dictValue == dictValue)?.dictLabel : '';
    } else {
      return ''
    }
  }

  const pathDict = (res: AppObject.DictMeta[]) => {
    res.forEach(s => {
      s.label = s.dictLabel
      s.value = s.dictValue
    })
    return res
  }

  const renderContent = () => {
    if (!VisitInfo) {
      return <Spinner style={{marginTop: 50}}/>
    }

    return (
      <>
        <SetStatusBar/>
        <ScrollView>
          <TableList title={translate('common.customerInfo')}>
            <TableRow
              title={translate(`common.visitTime`)}
              leftIcon={theme.assets.images.icons.table.urlschme}
              withArrow={false}
              rightText={`${visitInfo?.visitTime}`}
            />

            {Platform.OS == 'ios' && <>
              <TableChildren
                title={translate(`common.address`)}
                leftIcon={theme.assets.images.icons.table.email}
                withArrow={true}
                rightText={findDict(dictAddress, visitInfo?.address)}
              >
                <Picker
                  style={{position: 'absolute', width: 160, height: 0, transform: [{scaleX: 0}]}}
                  selectedValue={xAdr}
                  onValueChange={(itemValue: string, itemIndex) => {
                    setXAdr(itemValue)
                    setVisitInfo({...visitInfo, address: itemValue})
                  }
                  }>
                  {dictAddress?.map(address => {
                    return <Picker.Item key={address.dictCode} label={address.dictLabel}
                                        value={address.dictValue}/>
                  })}
                </Picker>
              </TableChildren>
              <TableChildren
                title={translate(`common.refund`)}
                leftIcon={theme.assets.images.icons.table.email}
                withArrow={true}
                rightText={findDict(dictRefund, visitInfo?.visitType1)}
              >
                <Picker
                  style={{position: 'absolute', width: 160, height: 0, transform: [{scaleX: 0}]}}
                  selectedValue={xFund}
                  onValueChange={(itemValue: string, itemIndex) => {
                    setXFund(itemValue)
                    setVisitInfo({...visitInfo, visitType1: itemValue})
                  }
                  }>
                  {dictRefund?.map(refund => {
                    return <Picker.Item key={refund.dictCode} label={refund.dictLabel}
                                        value={refund.dictValue}/>
                  })}
                </Picker>
              </TableChildren>
            </>}
            {
              Platform.OS == 'android' && <>
                <IosPicker
                  title="选择地址"
                  data={dictAddress}
                  cols={1}
                  value={[...xAdr]}
                  onChange={(itemValue: any) => {
                    setXAdr(itemValue)
                    setVisitInfo({...visitInfo, address: itemValue})
                  }}
                  onOk={(itemValue: any) => {
                    setXAdr(itemValue)
                    setVisitInfo({...visitInfo, address: itemValue})
                  }}>
                  <TableRow
                    title={translate(`common.address`)}
                    leftIcon={theme.assets.images.icons.table.email}
                    withArrow={true}
                  />
                </IosPicker>
                <IosPicker
                  title="请选择"
                  data={dictRefund}
                  cols={1}
                  value={[...xFund]}
                  onChange={(itemValue: any) => {
                    setXFund(itemValue)
                    setVisitInfo({...visitInfo, visitType1: itemValue})
                  }}
                  onOk={(itemValue: any) => {
                    setXFund(itemValue)
                    setVisitInfo({...visitInfo, visitType1: itemValue})
                  }}>
                  <TableRow
                    title={translate(`common.refund`)}
                    leftIcon={theme.assets.images.icons.table.email}
                    withArrow={true}
                  />
                </IosPicker>
              </>
            }
            <TableChildren
              title={translate(`common.nickName`)}
              leftIcon={theme.assets.images.icons.table.email}
              withArrow={true}
            >
              <Input
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                value={visitInfo?.visitor}
                onChangeText={(text) => setVisitInfo({...visitInfo, visitor: text})}
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
              placeholder={'请简短描述下备注'}
              keyboardType="default"
              returnKeyType="next"
              autoCorrect={false}
              value={visitInfo?.remark}
              editable={true}
              onChangeText={(text) => setVisitInfo({...visitInfo, remark: text})}
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
    height: 40,
    width: 200,
    borderWidth: 0,
    right: 8,
    position: "absolute",
    backgroundColor: 'transparent'
  }),
  inputSingle: (theme: ITheme): TextStyle => ({
    textAlign: 'right',
    writingDirection: 'rtl',
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
export default VisitInfo
