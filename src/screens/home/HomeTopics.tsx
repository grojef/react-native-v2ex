import {InterestNodesScreenProps as ScreenProps, ROUTES} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import React, {useEffect} from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import {FetchTopicCardList, HeaderButton} from '../components'
import navigationService from "@src/navigation/NavigationService";

const HomeTopics = ({route, navigation}: ScreenProps) => {


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButton
                    onPress={() => navigationService.navigate(ROUTES.Search)}
                    source={theme.assets.images.icons.header.search}
                    containerStyle={[{marginRight: theme.dimens.layoutContainerHorizontalMargin}]}
                />
            )
        })
    }, [])

    const {theme} = useTheme()
    return (
        <View style={[SylCommon.Layout.fill, {backgroundColor: theme.colors.background}]}>
            <FetchTopicCardList displayStyle="home"/>
        </View>
    )
}

export default connect()(HomeTopics)
