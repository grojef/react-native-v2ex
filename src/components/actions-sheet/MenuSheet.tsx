import React, {useRef} from 'react'
import ActionSheet, {ActionSheetRef, registerSheet, SheetProps} from 'react-native-actions-sheet'
import MenuButton from './Btn'
import {useAppSelector} from "@src/hooks";
import {RootState} from "@src/store";
import {useDict} from "@src/hooks/useDict";

const Sheet = (props: SheetProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const {payload: {press}} = props
  const {dict} = useDict()
  const allNode = dict && dict.get('cms_ctm_tag');
  const renderMenu = () => {
    return (<>
        {allNode && allNode.map((tag) => {
          return (<MenuButton key={tag.dictValue} title={tag.dictLabel}
                              onPress={() => press(tag.dictValue)}/>)
        })}
      </>
    )
  }
  return (
    <ActionSheet
      ref={actionSheetRef}
      id={props.sheetId}
      statusBarTranslucent
      gestureEnabled={true}
      containerStyle={{}}
      indicatorStyle={{backgroundColor: 'rgba(71, 87, 114, 0.13)'}}>
      {renderMenu()}
    </ActionSheet>
  )
}

registerSheet('menu-sheet', Sheet)

export default Sheet
