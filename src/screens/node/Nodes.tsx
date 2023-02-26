/**
 * Created by leon<silenceace@gmail.com> on 22/3/10.
 */


import {
  NODE_TABS,
  NodesScreenProps as ScreenProps,
} from '@src/navigation'
import {SylCommon, useTheme} from '@src/theme'
import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {FetchTopicCardList, HeaderButton} from '../components'
import {SheetManager} from "react-native-actions-sheet";
import {View} from "react-native";


const Node = ({route, navigation}: ScreenProps) => {
  const {theme} = useTheme()

  const [tag, setTag] = useState('');
  const [fea, setFea] = useState('');

  const parsData = (data: any) => {
    console.log(data)
    setTag(()=>data.sTag)
    setFea(()=>data.sFea)
  }

  const search = () => {
    SheetManager.show('search-sheet', {
      onClose: (data: any) => {
        if (data && data.bool == true) {
          parsData(data);
        } else {
          setFea('')
          setTag('')
        }
      },
      payload: {tag: tag, fea: fea}
    })
  }


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={search} source={theme.assets.images.icons.header.search}
                      containerStyle={[{marginRight: theme.dimens.layoutContainerHorizontalMargin}]}
        />
      )
    })
  }, []);

  return (
    <View style={SylCommon.Layout.fill}>
      <FetchTopicCardList tag={tag} fea={fea} displayStyle="simple"
                          nodeName={NODE_TABS.HOT}/>
    </View>
  )
}
export default connect()(Node)
