import React, {useRef} from 'react'
import ActionSheet, {ActionSheetRef, registerSheet, SheetProps} from 'react-native-actions-sheet'
import MenuButton from './Btn'
import {useAppSelector} from "@src/hooks";
import {RootState} from "@src/store";

const Sheet = (props: SheetProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const {payload: {press}} = props
  const allNode = useAppSelector((_state: RootState) => _state.app.allNode)
  const renderMenu = () => {
    return (<>
        {allNode?.map((tag) => {
          return (<MenuButton key={tag.dictValue} title={tag.dictLabel} onPress={() => press(tag.dictValue)}/>)
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
