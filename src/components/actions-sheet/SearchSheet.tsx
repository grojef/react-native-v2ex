/**
 * Created by leon<silenceace@gmail.com> on 22/3/10.
 */
import {Button} from '@src/components'
import {translate} from '@src/i18n'
import {SylCommon, useTheme} from '@src/theme'
import {AppObject, ITheme} from '@src/types'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native'
import ActionSheet, {ActionSheetRef, SheetManager, SheetProps} from 'react-native-actions-sheet'
import {ApiLib} from "@src/api";


const SearchActionSheet = (props: SheetProps) => {
  const {theme} = useTheme()
  const {
    sheetId,
    payload: {
      height,
      fea,
      tag,
      confirmText = translate('common.confirm'),
      cancelText = translate('common.cancel')
    }
  } = props
  const actionSheetRef = useRef<ActionSheetRef>(null)

  const [tags, setTags] = useState<AppObject.DictMeta[]>([]);
  const [features, setFeatures] = useState<AppObject.DictMeta[]>();

  const initTags = useCallback(() => {
    ApiLib.dict.dict('cms_ctm_tag').then(res => {
      setTags(res)
    })
  }, [])

  const initFeatures = useCallback(() => {
    ApiLib.dict.dict('cms_feature').then(res => {
      setFeatures(res)
    })
  }, [])

  useEffect(() => {
      initTags()
      initFeatures()
  }, []);


  const [sTag, setsTag] = useState(tag);
  const [sFea, setsFea] = useState(fea);

  const buttonConfirm = (yes: boolean) => {
    SheetManager.hide(sheetId, {
      payload: {'bool': yes, 'sTag': sTag, 'sFea': sFea},
      context: 'global'
    })
  }


  return (
    <ActionSheet
      id={sheetId}
      springOffset={50}
      onBeforeShow={(data) => console.log(data)}
      ref={actionSheetRef}
      statusBarTranslucent
      drawUnderStatusBar={true}
      useBottomSafeAreaPadding={false}
      gestureEnabled={true}
      defaultOverlayOpacity={0.5}
      containerStyle={{
        paddingTop: theme.spacing.medium,
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
      }}>
      <View style={[styles.container(theme), SylCommon.Card.container(theme), {height: height}]}>
        <View><Text style={styles.label(theme)}>标签:</Text></View>
        <View style={[styles.tagContainer()]}>
          {tags?.map(tag => {
            return (<TouchableOpacity key={tag.dictCode} onPress={() => {
              setsTag(tag.dictValue == sTag ? '' : tag.dictValue)
            }}><View style={[styles.tagItem(), tag.dictValue == sTag && styles.tagItemHit()]}><Text
              style={styles.text(theme)}>{tag.dictLabel}</Text></View></TouchableOpacity>)
          })}
        </View>
        <View><Text style={styles.label(theme)}>属性:</Text></View>
        <View style={[styles.tagContainer()]}>
          {features?.map(tag => {
            return (<TouchableOpacity key={tag.dictCode} onPress={() => {
              setsFea(tag.dictValue == sFea ? '' : tag.dictValue)
            }}><View style={[styles.tagItem(), tag.dictValue == sFea && styles.tagItemHit()]}><Text
              style={styles.text(theme)}>{tag.dictLabel}</Text></View></TouchableOpacity>)
          })}
        </View>
        <View style={styles.buttonContainer(theme)}>
          <Button
            type="large"
            onPress={() => buttonConfirm(false)}
            textColor={theme.colors.titleText}
            style={[
              styles.button(theme),
              {
                backgroundColor: theme.colors.transparent
              }
            ]}>
            {cancelText || translate('common.cancel')}
          </Button>
          <Button type="large" onPress={() => buttonConfirm(true)} style={styles.button(theme)}>
            {confirmText || translate('common.confirm')}
          </Button>
        </View>
      </View>
    </ActionSheet>
  )
}

const styles = {
  safeareview: (theme: ITheme): ViewStyle => ({}),
  container: (theme: ITheme): ViewStyle => ({
    paddingBottom: theme.spacing.small,
    width: '100%',
    maxHeight: theme.dimens.WINDOW_HEIGHT / 2,
    minHeight: theme.dimens.WINDOW_HEIGHT / 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface
  }),
  title: (theme: ITheme): TextStyle => ({
    ...theme.typography.headingTextBold,
    paddingVertical: theme.spacing.small,
    alignSelf: 'center'
  }),
  text: (theme: ITheme): TextStyle => ({
    ...theme.typography.labelText,
    width: '100%',
    textAlign: 'center',
    lineHeight: 12,
    paddingVertical: theme.spacing.small
  }),

  label: (theme: ITheme): TextStyle => ({
    ...theme.typography.labelText,
    width: '100%',
    textAlign: 'center',
    lineHeight: 12,
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: theme.spacing.small
  }),


  tagContainer: (): ViewStyle => ({
    flex: 1, flexDirection: 'row', flexWrap: 'wrap'
  }),

  tagItem: (): ViewStyle => ({
    borderRadius: 6,
    borderWidth: 1,
    height: 28,
    width: 60,
    margin: 6
  }),
  tagItemHit: (): ViewStyle => ({
    backgroundColor: '#898B8B',
  }),
  buttonContainer: (theme: ITheme): ViewStyle => ({
    paddingVertical: theme.spacing.small,
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  }),
  button: (theme: ITheme): ViewStyle => ({
    width: '48%',
    borderRadius: 20
  })
}

export default SearchActionSheet
