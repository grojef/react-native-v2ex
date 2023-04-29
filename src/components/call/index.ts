// @ts-ignore
import CallDetectorManager from 'react-native-call-detection'

class CallDetector {

    func: ((duration: number) => void) | undefined

    time: number | undefined

    caller: CallDetectorManager
    startListenerTapped = () => {
        this.caller = new CallDetectorManager((event: any, phoneNumber: number) => {
                if (event === 'Disconnected') {
                    console.log('Disconnected', phoneNumber)
                    // @ts-ignore
                    const duration = (new Date().getTime() - this.time) / 1000;
                    this.func && this.func(duration)
                } else if (event === 'Connected') {
                    console.log('Connected', phoneNumber)
                } else if (event === 'Dialing') {
                    this.time = new Date().getTime();
                    console.log('Dialing', phoneNumber)
                } else if (event === 'Offhook') {
                    console.log('Offhook', phoneNumber)
                    // @ts-ignore
                    this.time = new Date().getTime();
                } else if (event === 'Missed') {
                    console.log('Missed', phoneNumber)

                }
            },
            true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
            () => {
                console.log('Phone State Permission')
            }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
            {
                title: 'Phone State Permission',
                message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
            } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
        )
    }
    stopListenerTapped = () => {
        this.caller && this.caller.dispose();
    }
}


const callDetector = new CallDetector()

export default callDetector
