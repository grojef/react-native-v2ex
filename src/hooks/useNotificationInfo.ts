/**
 * Created by leon<silenceace@gmail.com> on 22/2/25.
 */
import { RootState } from '@src/store'
import { useEffect, useState } from 'react'
import { AppObject } from '../types'
import { useAppDispatch, useAppSelector } from './'

export const useNotificationInfo = ({ noticeId }: { noticeId: number }) => {
  const [notification, setNotification] = useState<AppObject.Notification | undefined>(undefined)
  const v2ex = useAppSelector((_state: RootState) => _state.app.v2ex)

  useEffect(() => {
    const fetchNotification = async () => {
      const _notification = await v2ex?.notification.info(noticeId)
      setNotification(_notification)
    }
    if (noticeId) {
      fetchNotification()
    }
  }, [noticeId, v2ex])

  return {
    notification
  }
}
