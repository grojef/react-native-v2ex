/**
 * Created by leon<silenceace@gmail.com> on 22/04/01.
 */
import { NavigationService, ROUTES } from '@src/navigation'
import React, { useMemo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { Text } from '@src/components'
import { SylCommon, useTheme } from '@src/theme'

/**
 * ProfileGrid props
 */
export interface WorkGridProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>
  topics?: number
  favorites?: number
  following?: number
  history?: number
}

const WorkGrid: React.FC<WorkGridProps> = ({
  containerStyle,
  topics,
  favorites,
  following,
  history
}: WorkGridProps) => {
  const list = useMemo(
    () => [
      {
        text: '报备记录',
        count: topics,
        press: () => NavigationService.navigate(ROUTES.VisitInfoList)
      },
      {
        text: '公告通知',
        count: favorites,
        press: () => NavigationService.navigate(ROUTES.Notifications)
      }
    ],
    [topics, favorites, following, history]
  )

  const { theme } = useTheme()

  const renderContent = () => {
    // return (
    //   <View style={containerStyle}>
    //     <TextGrid list={list} columnNum={9}/>
    //   </View>
    // )

    return (
      <View
        style={[
          SylCommon.Card.container(theme),
          {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap'
          }
        ]}>
        <View
          style={{
            width: '33%',
            height: 80,
            borderColor: 'gray',
            borderWidth: 0.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Text>你好</Text>
        </View>
        <View
          style={{
            width: '33%',
            height: 80,
            borderColor: 'gray',
            borderWidth: 0.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Text>你好</Text>
        </View>
        <View
          style={{
            width: '33%',
            height: 80,
            borderColor: 'gray',
            borderWidth: 0.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Text>你好</Text>
        </View>
      </View>
    )
  }

  return renderContent()
}

export default WorkGrid
