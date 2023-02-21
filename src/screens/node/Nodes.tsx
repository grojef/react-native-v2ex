/**
 * Created by leon<silenceace@gmail.com> on 22/3/10.
 */

import * as Actions from '@src/actions'
import {Placeholder, Text, useToast} from '@src/components'
import {nodeChildren, TabNodes} from '@src/helper/node'
import {translate} from '@src/i18n'
import {
  NavigationService,
  NODE_TABS,
  NodesScreenProps as ScreenProps,
  ROUTES
} from '@src/navigation'
import {RootState} from '@src/store'
import {SylCommon, useTheme} from '@src/theme'
import {ITheme, AppObject} from '@src/types'
import React, {useEffect} from 'react'
import {SectionList, TouchableOpacity, View, ViewStyle} from 'react-native'
import {connect} from 'react-redux'
import {FetchTopicCardList, HeaderButton} from '../components'
import {actionSheetEventManager} from "react-native-actions-sheet/dist/src/eventmanager";
import {SheetManager} from "react-native-actions-sheet";
import {logout as actionLogout} from "@src/actions";

// const Node = ({
//   navigation,
//   allNode,
//   fetchAllNode
// }: ScreenProps & {
//   allNode?: AppObject.Node[]
//   fetchAllNode: () => void
// }) => {
//   const { theme } = useTheme()
//   const { showMessage } = useToast()
//
//   const underConstruction = () => {
//     showMessage({
//       type: 'error',
//       text2: translate('label.underConstruction')
//     })
//   }
//
//   const Item = ({ list, title }: { list: AppObject.Node[]; title: string }) => (
//     <View style={[SylCommon.Card.container(theme), styles.sectionContainer(theme)]}>
//       <Text style={{ ...theme.typography.subheadingTextBold }}>{title}</Text>
//       <View style={styles.nodeListContainer(theme)}>
//         {list.map((node) => (
//           <TouchableOpacity
//             key={node.dictLabel}
//             style={styles.item(theme)}
//             onPress={() => {
//               NavigationService.goNodeDetail(node.dictLabel, node.dictLabel)
//             }}>
//             <Text style={SylCommon.Node.nodeTitle(theme)}>{node.dictLabel}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   )
//
//   const sectionData = () => {
//     return allNode?.map((node, idx) => ({
//       title: node.dictLabel,
//       data: [
//         {
//           name: 'children' + idx,
//           title: node.dictLabel,
//           list: nodeChildren(null, allNode)
//         }
//       ],
//       key: node.dictLabel
//     })).filter((v) => v.data.length > 0)
//   }
//
//   const renderContent = () => {
//     const data = sectionData()
//
//     if (data.length === 0) {
//       return (
//         <Placeholder
//           buttonText={translate('button.tryAgain')}
//           placeholderText={translate('errors.noFound')}
//           buttonPress={fetchAllNode}
//         />
//       )
//     }
//     console.log(data)
//     return (
//       <SectionList
//         sections={data}
//         contentContainerStyle={[]}
//         keyExtractor={(item, index) => item.name + index}
//         renderItem={({ item }) => <Item {...item} />}
//         stickySectionHeadersEnabled={true}
//         renderSectionHeader={undefined}
//       />
//     )
//   }
//   return <View style={SylCommon.Layout.fill}>{renderContent()}</View>
// }
//
// /**
//  * @description styles settings
//  */
// const styles = {
//   sectionContainer: (theme: ITheme) => ({
//     paddingVertical: theme.spacing.medium,
//     marginBottom: theme.spacing.medium
//   }),
//   nodeListContainer: (theme: ITheme): ViewStyle => ({
//     paddingTop: theme.spacing.small,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start'
//   }),
//   item: (theme: ITheme): ViewStyle => ({
//     width: 'auto',
//     borderRadius: theme.spacing.tiny,
//     borderColor: theme.colors.border,
//     borderWidth: 0.7,
//     marginRight: theme.spacing.small,
//     marginVertical: theme.spacing.tiny
//   })
// }
//
// const mapStateToProps = ({ app: { allNode } }: RootState) => {
//   return { allNode }
// }

const Node = ({route, navigation}: ScreenProps) => {
  const {theme} = useTheme()

  const search = () => {
    SheetManager.show('search-sheet', {
      onClose: (data: any) => {
        if (data === true) {
        }
      },
      payload: {
        description: translate('confirm.logout')
      }
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
      <FetchTopicCardList displayStyle="full" nodeName={NODE_TABS.HOT}/>
      {/*<CheckUpdate />*/}
    </View>
  )
}
export default connect()(Node)
