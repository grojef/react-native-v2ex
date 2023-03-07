import {StyleProp, TextStyle, View, ViewStyle} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {TextWithIconPress} from "@src/screens/components";
import {ITheme, SylCommon, useTheme} from "@src/theme";
import {Button, useToast} from "@src/components";
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {Picker} from "@react-native-picker/picker";
import {defaultDictMeta} from "@src/helper/defaultDictMeta";

export interface CountDownProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  refreshData?: any

}

const CountDown: React.FC<CountDownProps> = ({refreshData}: CountDownProps) => {
  const [counter, setCounter] = useState(0);
  let cd = useRef<number>(counter);
  const timer = useRef<any>(null);
  const [time, setTime] = useState<string>(`倒计时: 0时0分0秒`);
  const decrease = () => {
    timer.current = setInterval(() => {
      if (cd.current <= 0) {
        timer.current && clearInterval(timer.current)
        return
      }
      cd.current--
      const h = parseInt(((cd.current / (60 * 60)) % 24) + '');
      const m = parseInt(((cd.current / 60) % 60) + '');
      const s = parseInt((cd.current % 60) + '');
      setTime(`倒计时: ${h}时${m}分${s}秒`)
    }, 1000)
  }

  useEffect(() => {
    cd.current = counter
    decrease()
    return () => {
      timer.current && clearInterval(timer.current)
    };

  }, [counter]);

  const {theme} = useTheme()
  const {showMessage} = useToast();

  const [allNode, setAllNode] = useState<AppObject.DictMeta[]>([]);

  const initTags = useCallback(() => {
    ApiLib.dict.dict('cms_ctm_tag').then(res => {
      res.unshift(defaultDictMeta)
      setAllNode(res)
    })
  }, [])

  const initializedRef = useRef(false);

  useEffect(() => {
    initTags()
  }, []);


  const pressTag = (labelValue: string) => {
    ApiLib.topic.grab(labelValue).then((data) => {
      showMessage("认领成功！")
      if (data.delayTime) {
        setCounter(data.delayTime)
      }
      refreshData()
    }).catch((res) => {
      showMessage({text1: res.msg, type: 'error'})
      if (res.data && res.data.delayTime) {
        setCounter(res.data.delayTime)
      }
    });
  }
  return (
    (<View style={[styles.refreshContainer(theme), SylCommon.Card.container(theme)]}>
      <View
        style={[styles.refreshLeft(theme), styles.refreshBox()]}>
        <TextWithIconPress
          containerStyle={{
            height: 30,
            justifyContent: "center",
            borderColor: '#9a9a9a',
            borderWidth: 1,
            borderRadius: 5
          }}
          textStyle={{fontSize: 13, lineHeight: 28}}
          text={`${time}`}
        />
      </View>
      <View style={[styles.refreshRight(theme), styles.refreshBox()]}>
        <Button disabled={cd.current > 0} onPress={() => {
        }} type={"small"} style={{height: 30}}>刷新</Button>
        <Picker
          style={styles.picker()}
          enabled={cd.current <= 0}
          selectedValue={undefined}
          onValueChange={(itemValue: string) => {
            initializedRef.current && pressTag(itemValue)
            initializedRef.current = true
          }
          }>
          {allNode?.map(intent => {
            return <Picker.Item key={intent.dictCode} label={intent.dictLabel}
                                value={intent.dictValue}/>
          })}
        </Picker>
      </View>
    </View>)
  );

}

/**
 * @description styles settings
 */
const styles = {
  container: (theme: ITheme): ViewStyle => ({
    paddingBottom: theme.spacing.extraLarge,
    maxHeight: theme.dimens.WINDOW_HEIGHT / 2,
    minHeight: theme.dimens.WINDOW_HEIGHT / 6,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.colors.surface
  }),

  itemSeparator: (theme: ITheme) => ({
    height: 0
  }),
  refreshContainer: (theme: ITheme): ViewStyle => ({
    backgroundColor: '#fff',
    flexDirection: "row",
  }),
  refreshBox: (): ViewStyle => ({
    flex: 1,
    justifyContent: 'space-between',
    height: 38,
    padding: 1
  }),
  refreshLeft: (theme: ITheme): ViewStyle => ({}),
  refreshRight: (theme: ITheme): ViewStyle => ({}),
  tagContainer: (theme: ITheme): ViewStyle => ({
    paddingBottom: theme.spacing.medium,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  }),

  label: (theme: ITheme): TextStyle => ({
    ...theme.typography.labelText,
    width: '100%',
    textAlign: 'center',
    lineHeight: 12,
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: theme.spacing.small
  }),
  tagItem: (): ViewStyle => ({
    borderRadius: 6,
    borderWidth: 1,
    height: 28,
    width: 60,
    margin: 6
  }),
  text: (theme: ITheme): TextStyle => ({
    ...theme.typography.labelText,
    width: '100%',
    textAlign: 'center',
    lineHeight: 12,
    paddingVertical: theme.spacing.small
  }),
  picker: (): TextStyle => ({
    position: "absolute",
    height: 0,
    width: '100%',
    transform: [{scaleX: 0}],
    color: '#9a9a9a'
  })

}

export default CountDown
