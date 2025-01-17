import {StyleProp, TextStyle, View, ViewStyle} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {ITheme, SylCommon, useTheme} from "@src/theme";
import {Button} from "@src/components";
import {ApiLib} from "@src/api";
import {AppObject} from "@src/api/types";
import {Picker} from "@react-native-picker/picker";
import {defaultDictMeta} from "@src/helper/defaultDictMeta";

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
      setAllNode(res)
    })
    ApiLib.dict.dict('cms_feature').then(res => {
      res.unshift(defaultDictMeta)
      setFeatures(res)
    })
  }, [])


  useEffect(() => {
    initTags()
  }, []);

  const [qTag, setQTag] = useState('');
  const [qFeat, setQFeat] = useState('');

  return (
    (<View style={[styles.refreshContainer(theme),SylCommon.Card.container(theme)]}>
      <View
        style={[styles.refreshLeft(theme), styles.refreshBox()]}>
        <Button onPress={() => {
        }} type={"small"}
                style={{height: 30}}>标签-{allNode.find(s => s.dictValue == qTag)?.dictLabel}</Button>
        <Picker
          style={styles.picker()}
          selectedValue={qTag}
          onValueChange={(itemValue: string) => {
            setQTag(itemValue)
            onDataChange({...refreshData, qTag: itemValue})
          }
          }>
          {allNode?.map(intent => {
            return <Picker.Item key={intent.dictCode} label={intent.dictLabel}
                                value={intent.dictValue}/>
          })}
        </Picker>
      </View>
      <View style={[styles.refreshRight(theme), styles.refreshBox()]}>
        <Button onPress={() => {
        }} type={"small"} style={{
          height: 30,
          width: '100%'
        }}>属性-{features.find(s => s.dictValue == qFeat)?.dictLabel}</Button>
        <Picker
          style={styles.picker()}
          selectedValue={qFeat}
          onValueChange={(itemValue: string) => {
            setQFeat(itemValue)
            onDataChange({...refreshData, qFeat: itemValue})
          }
          }>
          {features?.map(feature => {
            return <Picker.Item key={feature.dictCode} label={feature.dictLabel}
                                value={feature.dictValue}/>
          })}
        </Picker>
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
