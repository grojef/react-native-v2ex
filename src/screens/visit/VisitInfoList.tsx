import VisitInfoListFc from "@src/screens/components/visit/VisitInfoListFc";
import {SylCommon, useTheme} from "@src/theme";
import React, {useLayoutEffect} from "react";
import {EditTopicHeaderButton} from "@src/screens/components/button";
import NavigationService from "@src/navigation/NavigationService";
import {ROUTES, TopicDetailScreenProps as ScreenProps} from "@src/navigation";
import {translate} from "@src/i18n";

const VisitInfoList = ({navigation}: ScreenProps) => {
  const {theme} = useTheme()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        (
          <EditTopicHeaderButton text={translate(`common.add`)} onPress={() => {
            NavigationService.navigate(ROUTES.VisitInfo, {})
          }}/>
        )
    })
  }, [navigation])


  return <VisitInfoListFc
    containerStyle={[SylCommon.Card.container(theme), {paddingTop: theme.spacing.small}]}/>
}

export default VisitInfoList
