import {InterestNodesScreenProps as ScreenProps} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import React from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import SearchTopicCardList from "@src/screens/components/topic/SearchTopicCardList";

const SearchTopics = ({ route, navigation }: ScreenProps) => {


  const { theme } = useTheme()
  return (
    <View style={[SylCommon.Layout.fill, { backgroundColor: theme.colors.background }]}>
      <SearchTopicCardList/>
    </View>
  )
}

export default connect()(SearchTopics)
