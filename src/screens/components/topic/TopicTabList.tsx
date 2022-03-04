import * as React from 'react'
import { View, Text } from 'react-native'

import { IState, ITheme, V2exObject } from '@src/types'
import TopicList from './TopicList'
import { HomeScreenProps as ScreenProps, HOME_NODES, NODE_TAB_TYPE } from '@src/navigation'

const TopicTabList = ({ tabs }: { tabs: Array<NODE_TAB_TYPE> }) => {
  return (
    <View>
      <TopicList />
    </View>
  )
}

export default TopicTabList
