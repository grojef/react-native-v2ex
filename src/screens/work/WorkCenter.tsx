import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {BorderLine} from '@src/screens/components'
import {SylCommon, useTheme} from '@src/theme'
import {NavigationService, ROUTES} from '@src/navigation'

const WorkCenter = () => {
  const { theme } = useTheme()
  return (
    <ScrollView>
      <View style={[styles.container, SylCommon.Card.container(theme)]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>服务中心</Text>
        </View>
        <BorderLine />
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.item, styles.borderRight]}
            onPress={() => {
              NavigationService.navigate(ROUTES.VisitInfoList)
            }}>
            <Image source={theme.assets.images.icons.table.github} style={styles.itemIcon} />
            <Text style={styles.itemTitle}>报备记录</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.item, styles.borderRight]}
            onPress={() => {
              NavigationService.navigate(ROUTES.Notifications)
            }}>
            <Image source={theme.assets.images.icons.table.email} style={styles.itemIcon} />
            <Text style={[styles.itemTitle]}>消息通知</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[styles.item]}
              onPress={() => {
                NavigationService.navigate(ROUTES.SiteStat)
              }}>
            <Image source={theme.assets.images.icons.table.cached} style={styles.itemIcon} />
            <Text style={[styles.itemTitle]}>通话统计</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, styles.borderTop, styles.borderRight]}></TouchableOpacity>
          <TouchableOpacity style={[styles.item, , styles.borderTop, styles.borderRight]}></TouchableOpacity>
          <TouchableOpacity style={[styles.item, , styles.borderTop, styles.borderRight]}></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  header: {
    height: 32,
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 3
  },
  headerImage: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    marginRight: 8
  },
  headerTitle: {
    fontSize: 14,
    color: '#222222'
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'lightgrey',
    borderRadius: 3
  },
  borderTop: {
    borderColor: '#FFE',
    borderStyle: 'solid',
    borderTopWidth: 0.5
  },
  borderRight: {
    borderColor: '#FFE',
    borderStyle: 'solid',
    borderRightWidth: 0.5
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '33.3%',
    height: 100,
    justifyContent: 'center',
    borderColor: '#111010'
  },
  itemIcon: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  itemTitle: {
    fontSize: 16,
    color: '#333333'
  }
})

export default WorkCenter
