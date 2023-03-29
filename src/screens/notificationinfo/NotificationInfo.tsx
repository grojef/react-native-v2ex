import { NotificationInfoScreenProps as ScreenProps } from '@src/navigation/routes'
import { connect } from 'react-redux'
import { NotificationDetail } from '../components'
import { useEffect, useState } from 'react'
import { AppObject } from '@src/api/types'
import { ApiLib } from '@src/api'

const NotificationInfo = ({ route }: ScreenProps) => {
  const [notification, setNotification] = useState<AppObject.Notification | undefined>(undefined)
  const { noticeId } = route.params
  useEffect(() => {
    ApiLib.notification.info(noticeId).then((res) => {
      setNotification(res)
    })
  }, [noticeId])

  // @ts-ignore
  return <NotificationDetail containerStyle={[]} info={notification} />
}

export default connect()(NotificationInfo)
