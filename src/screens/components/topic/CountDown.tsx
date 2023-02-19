import {StyleProp, View, ViewStyle} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {TextWithIconPress} from "@src/screens/components";
import {ITheme, SylCommon, useTheme} from "@src/theme";
import {Button, useToast} from "@src/components";
import {SheetManager} from "react-native-actions-sheet";
import {ApiLib} from "@src/api";

export interface CountDownProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>

  refreshData?:any

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
  const pressTag = (labelValue: string) => {
    SheetManager.hide('menu-sheet')
    ApiLib.topic.grab(labelValue).then((data) => {
      showMessage("认领成功！")
      if (data.delayTime) {
        setCounter(data.delayTime)
      }
    }).catch((res) => {
      showMessage({text1: res.msg, type: 'error'})
      if (res.data && res.data.delayTime) {
        setCounter(res.data.delayTime)
      }
    });
  }
  return (
    (<View style={styles.refreshContainer(theme)}>
      <View
        style={[styles.refreshLeft(theme), styles.refreshBox()]}>
        <TextWithIconPress
          containerStyle={{
            height: 30,
            paddingLeft: 10,
            borderColor: '#9a9a9a',
            borderWidth: 1,
            borderRadius: 5
          }}
          textStyle={{fontSize: 13, lineHeight: 28}}
          text={`${time}`}
        />
      </View>
      <View style={[styles.refreshRight(theme), styles.refreshBox()]}>
        <Button disabled={cd.current>0} onPress={() => {
          SheetManager.show('menu-sheet', {
            payload: {press: pressTag}
          })
        }} type={"small"} style={{height: 30}}>刷新</Button>
      </View>
    </View>)
  );

}

/**
 * @description styles settings
 */
const styles = {
  container: (theme: ITheme): ViewStyle => ({
    flex: 1
  }),
  topicItemContainer: (theme: ITheme): ViewStyle => ({
    ...SylCommon.Card.container(theme)
  }),
  itemSeparator: (theme: ITheme) => ({
    height: 0
  }),
  refreshContainer: (theme: ITheme): ViewStyle => ({
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small,
    backgroundColor: '#fff',
    flexDirection: "row",
  }),
  refreshBox: (): ViewStyle => ({
    flex: 1,
    justifyContent: 'space-between',
    height: 50,
    padding: 10
  }),
  refreshLeft: (theme: ITheme): ViewStyle => ({}),
  refreshRight: (theme: ITheme): ViewStyle => ({}),
}

export default CountDown
