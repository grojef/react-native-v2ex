import React, { useRef } from 'react'
import ActionSheet, { ActionSheetRef, registerSheet, SheetProps } from 'react-native-actions-sheet'
import { useTheme } from '@src/theme'

const Sheet = (props: SheetProps) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const {
    payload: { renderMenu }
  } = props
  const { theme } = useTheme()
  return (
    <ActionSheet
      ref={actionSheetRef}
      id={props.sheetId}
      statusBarTranslucent
      gestureEnabled={true}
      containerStyle={{
        paddingTop: theme.spacing.medium,
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
      }}
      indicatorStyle={{ backgroundColor: 'rgba(71, 87, 114, 0.13)' }}>
      {renderMenu()}
    </ActionSheet>
  )
}

registerSheet('menu-sheet', Sheet)

export default Sheet
