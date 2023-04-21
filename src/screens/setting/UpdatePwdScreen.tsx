import React, {useState} from 'react'
import {Button, InputItem, Text, Toast, View} from '@ant-design/react-native'

const UpdatePwdScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChangePassword = () => {
    // TODO: Implement password change logic here
    if (newPassword !== confirmPassword) {
      Toast.fail('Passwords do not match')
    } else {
      Toast.success('Password changed successfully')
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Change Password</Text>
      <InputItem
        type="password"
        value={currentPassword}
        placeholder="Current Password"
        onChange={(value: any) => setCurrentPassword(value)}
        style={{ marginBottom: 20 }}
      />
      <InputItem
        type="password"
        value={newPassword}
        placeholder="New Password"
        onChange={(value: any) => setNewPassword(value)}
        style={{ marginBottom: 20 }}
      />
      <InputItem
        type="password"
        value={confirmPassword}
        placeholder="Confirm Password"
        onChange={(value: any) => setConfirmPassword(value)}
        style={{ marginBottom: 20 }}
      />
      <Button type="primary" onPress={handleChangePassword} style={{ marginTop: 20 }}>
        Change Password
      </Button>
    </View>
  )
}

export default UpdatePwdScreen
