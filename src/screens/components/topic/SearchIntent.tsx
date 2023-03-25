import {StyleProp, TextStyle, View, ViewStyle} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {ITheme, SylCommon, useTheme} from "@src/theme";
import {Button} from "@src/components";
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {defaultDictMeta} from "@src/helper/defaultDictMeta";
import {Picker as IosPicker} from "@ant-design/react-native";

export interface SearchIntentProps {
  /**
   * container style
   */
  containerStyle?: StyleProp<ViewStyle>
  refreshData: { qTag: string, qFeat: string },
  onDataChange: ({}: { qTag: string, qFeat: string }) => void
}

const SearchIntent: React.FC<SearchIntentProps> = ({
                                                     refreshData,
                                                     onDataChange
                                                   }: SearchIntentProps) => {

  const {theme} = useTheme()
  const [allNode, setAllNode] = useState<AppObject.DictMeta[]>([]);
  const [features, setFeatures] = useState<AppObject.DictMeta[]>([]);

  const initTags = useCallback(() => {
    ApiLib.dict.dict('cms_ctm_tag').then(res => {
      res.unshift(defaultDictMeta)
      setAllNode(pathDict(res))
    })
    ApiLib.dict.dict('cms_feature').then(res => {
      res.unshift(defaultDictMeta)
      setFeatures(pathDict(res))
    })
  }, [])

  const pathDict = (res: AppObject.DictMeta[]) => {
    res.forEach(s => {
      s.label = s.dictLabel
      s.value = s.dictValue
    })
    return res
  }
  useEffect(() => {
    initTags()
  }, []);

  const [qTag, setQTag] = useState('');
  const [qFeat, setQFeat] = useState('');

  return (
    (<View style={[styles.refreshContainer(theme), SylCommon.Card.container(theme)]}>
      <View
        style={[styles.refreshLeft(theme), styles.refreshBox()]}>
        <IosPicker
          title="选择标签"
          data={allNode}
          cols={1}
          value={[...qTag]}
          onChange={(v: any) => {
            setQTag(v)
            onDataChange({...refreshData, qTag: v})
          }}
          onOk={(v: any) => {
            setQTag(v)
            onDataChange({...refreshData, qTag: v})
          }}>
          <Button onPress={() => {
          }} type={"small"}
                  style={{height: 30}}>标签-{allNode.find(s => s.dictValue == qTag)?.dictLabel}</Button>
        </IosPicker>
      </View>
      <View style={[styles.refreshRight(theme), styles.refreshBox()]}>

        <IosPicker
          title="选择标签"
          data={features}
          cols={1}
          value={[...qFeat]}
          onChange={(v: any) => {
            setQFeat(v)
            onDataChange({...refreshData, qFeat: v})
          }}
          onOk={(v: any) => {
            setQFeat(v)
            onDataChange({...refreshData, qFeat: v})
          }}>
          <Button onPress={() => {
          }} type={"small"}
                  style={{height: 30}}>标签-{features.find(s => s.dictValue == qFeat)?.dictLabel}</Button>
        </IosPicker>
      </View>
    </View>)
  );

}

/**
 * @description styles settings
 */
const styles = {
  container: (theme: ITheme): ViewStyle => ({
    maxHeight: theme.dimens.WINDOW_HEIGHT / 2,
    minHeight: theme.dimens.WINDOW_HEIGHT / 6,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.colors.surface
  }),

  itemSeparator: (theme: ITheme) => ({
    height: 0
  }),
  refreshContainer: (theme: ITheme): ViewStyle => ({
    backgroundColor: '#fff',
    flexDirection: "row",
  }),
  refreshBox: (): ViewStyle => ({
    flex: 1,
    justifyContent: 'space-between',
    height: 38,
    padding: 1
  }),
  refreshLeft: (theme: ITheme): ViewStyle => ({}),
  refreshRight: (theme: ITheme): ViewStyle => ({}),
  tagContainer: (theme: ITheme): ViewStyle => ({
    paddingBottom: theme.spacing.medium,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
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
  tagItem: (): ViewStyle => ({
    borderRadius: 6,
    borderWidth: 1,
    height: 28,
    width: 60,
    margin: 6
  }),
  text: (theme: ITheme): TextStyle => ({
    ...theme.typography.labelText,
    width: '100%',
    textAlign: 'center',
    lineHeight: 12,
    paddingVertical: theme.spacing.small
  }),
  picker: (): TextStyle => ({
    position: "absolute",
    height: 0,
    width: '100%',
    transform: [{scaleX: 0}],
    color: '#9a9a9a'
  })

}

export default SearchIntent
