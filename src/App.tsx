/**
 * Created by leon<silenceace@gmail.com> on 22/2/21.
 */
import React from 'react'
import {PersistGate} from 'redux-persist/integration/react'
import {AppNavigationContainer} from './navigation/Navigator'
import {onAppStart} from './helper/app'
import {ThemeProvider} from './theme'
import {persistor, store} from '@src/store'
import {Spinner} from './components/common'
import {Provider as ConfigProvider} from '@ant-design/react-native'
import {Provider} from 'react-redux'

onAppStart(store)

const App = () => {
    return (
        <Provider store={store}>
            <ConfigProvider>
                <PersistGate loading={<Spinner />} persistor={persistor}>
                    <ThemeProvider>
                        <AppNavigationContainer />
                    </ThemeProvider>
                </PersistGate>
            </ConfigProvider>
        </Provider>
    )
}

export default App
