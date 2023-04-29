import {InterestNodesScreenProps as ScreenProps} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import React from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import {FetchTopicCardList} from '../components'

const IntentTopics = ({route, navigation}: ScreenProps) => {
    const {theme} = useTheme()

    return (
        <View style={SylCommon.Layout.fill}>
            <FetchTopicCardList displayStyle="intent"/>
            {/*<CheckUpdate />*/}
        </View>
    )
}

export default connect()(IntentTopics)
