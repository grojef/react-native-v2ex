import {Linking, NativeModules, Platform} from 'react-native'
// @ts-ignore
import CallDetectorManager from 'react-native-call-detection';

export default class Dialer {
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
            func()
        }
    }
}
