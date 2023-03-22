import {Image, Pressable, StyleProp, TextStyle, View, ViewStyle} from "react-native";
import React, {useEffect, useState} from "react";
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {Input} from "@src/components";
import {ITheme, useTheme} from "@src/theme";


export interface VerificationProps {
  dataChange: (uuid: string, code: string) => void
  containerStyle?: StyleProp<ViewStyle>
}


const Verification: React.FC<VerificationProps> = ({dataChange}: VerificationProps) => {

  const handleTextChange = (txt: string) => {
    dataChange(captcha.uuid, txt)
    setText(txt)
  };
  const [text, setText] = useState('');
  const {theme} = useTheme()

  const [captcha, setCaptcha] = useState<AppObject.Captcha>({
    captchaEnabled: true,
    img: "",
    uuid: ""
  });

  const fetchCaptcha = () => {
    setText('')
    ApiLib.member.captcha().then(res => {
      setCaptcha(res)
    })
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  return (
    captcha.captchaEnabled ?
      <View style={{height: 60, flexDirection: 'row'}}>
        <View style={{flex: 1, marginRight: 10, marginTop: 2}}>
          <Pressable onPress={() => fetchCaptcha()}>
            <Image source={{uri: `data:image/gif;base64,` + captcha.img}}
                   style={{maxWidth: '100%', height: 40}}/>
          </Pressable>
        </View>
        <View style={{flex: 1}}>
          <Input
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder={'请输入验证码'}
            keyboardType="default"
            returnKeyType="next"
            autoCorrect={false}
            textContentType="none"
            value={text}
            containerStyle={styles.input(theme)}
            onChangeText={handleTextChange}
          />
        </View>
      </View> : <></>
  );
}

const styles = {
  input: (theme: ITheme): TextStyle => ({
    width: '100%',
    marginBottom: theme.spacing.large,
    flex: 1
  }),
}

export default Verification

