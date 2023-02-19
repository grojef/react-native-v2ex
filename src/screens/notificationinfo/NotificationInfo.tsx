import {NotificationInfoScreenProps as ScreenProps} from '@src/navigation/routes'
import {connect} from 'react-redux'
import {NotificationDetail} from '../components'
import {useNotificationInfo} from "@src/hooks/useNotificationInfo";

const NotificationInfo = ({
                            route,
                          }: ScreenProps) => {
  const {notification} = useNotificationInfo({noticeId: route.params.noticeId})
  // @ts-ignore
  return <NotificationDetail containerStyle={[]} info={notification}/>
}

export default connect()(NotificationInfo)
