import {Linking, NativeModules, PermissionsAndroid, Platform} from 'react-native'
// @ts-ignore
import CallDetectorManager from 'react-native-call-detection';
import callDetector from "@src/components/call";

class Dialer {
    callPhone = (num: string, func: () => void): void => {
        if (Platform.OS === 'ios') {
            Linking.canOpenURL(`tel:${num}`)
                .then((supported) => {
                    if (!supported) {
                    } else {
                        Linking.openURL(`tel:${num}`).then(() => {
                            func()
                        })
                    }
                })
                .catch()
        } else {
            NativeModules.Dialer.call(num)
            if (callDetector.caller == null) {
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE).then(res => {
                    res && callDetector.startListenerTapped()
                })
            }
            func()
        }
    }
}

const dialer = new Dialer();

export default dialer
