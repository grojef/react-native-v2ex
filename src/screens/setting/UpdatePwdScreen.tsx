import React, {useState} from 'react'
import {ApiLib} from "@src/api";
import navigationService from "@src/navigation/NavigationService";
import {Button, Input, useToast} from "@src/components";
import {View} from "react-native";

const UpdatePwdScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const {showMessage} = useToast()
    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            showMessage({text1: '温馨提示', text2: '新密码和确认密码不一致', type: 'error'})
        } else if (newPassword.length<5 || newPassword.length >20) {
            showMessage({text1: '温馨提示', text2: '新密码长度在5~20之间', type: 'error'})
        } else if (newPassword == currentPassword) {
            showMessage({text1: '温馨提示', text2: '新密码和原密码不能一样', type: 'error'})
        } else {
            ApiLib.member.updatePwd(currentPassword, newPassword).then(res => {
                showMessage({text1: '温馨提示', text2: '修改成功！'})
                navigationService.goBack()
            }).catch(res => {
                showMessage({text1: '温馨提示', text2: res.msg, type: 'error'})
            })
        }
    }

    return (
        <View style={{padding: 10}}>
            <Input
                label={"原密码："}
                secureTextEntry={true}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                value={currentPassword}
                onChangeText={(value: any) => setCurrentPassword(value)}
                textContentType="none"
            />
            <Input
                secureTextEntry={true}
                label={"新密码："}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                value={newPassword}
                onChangeText={(value: any) => setNewPassword(value)}
                textContentType="none"
            />
            <Input
                label={"确认密码："}
                secureTextEntry={true}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                keyboardType="default"
                returnKeyType="next"
                autoCorrect={false}
                value={confirmPassword}
                onChangeText={(value: any) => setConfirmPassword(value)}
                textContentType="none"
            />
            <Button type={"large"} onPress={handleChangePassword} style={{marginTop: 20, width: '100%'}}>
                确认
            </Button>
        </View>
    )
}

export default UpdatePwdScreen
