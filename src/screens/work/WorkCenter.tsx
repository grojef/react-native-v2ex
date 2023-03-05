import {ScrollView, View} from "react-native";
import {BorderLine} from "@src/screens/components";
import {SylCommon, useTheme} from "@src/theme";
import WorkGrid from "@src/screens/components/work/WorkGrid";


const WorkCenter = () => {

  const {theme} = useTheme()
  return (
    <ScrollView>
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          paddingTop: theme.spacing.medium
        },
      ]}>
      <BorderLine/>
      <WorkGrid
        topics={1}
        favorites={2}
        following={3}
        history={4}
        containerStyle={[SylCommon.Card.container(theme), {paddingTop: theme.spacing.small}]}
      />
      <BorderLine/>
    </View>
    </ScrollView>
  )
}

export default WorkCenter
