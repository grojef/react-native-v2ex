/**
 * Created by leon<silenceace@gmail.com> on 22/2/25.
 */
import { RootState } from '@src/store'
import { useEffect, useState } from 'react'
import { readTopic } from '../actions'
import { AppObject } from '../types'
import { useAppDispatch, useAppSelector } from './'

export const useTopic = ({ topicId }: { topicId: number }) => {
  const [topic, setTopic] = useState<AppObject.Topic | undefined>(undefined)
  const v2ex = useAppSelector((_state: RootState) => _state.app.v2ex)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchTopic = async () => {
      const _topic = await v2ex?.topic.topic(topicId)
      if (_topic) {
        dispatch(readTopic(_topic) as any)
      }

      setTopic(_topic)
    }

    if (topicId) {
      fetchTopic()
    }
  }, [topicId, v2ex, dispatch])

  return {
    topic
  }
}
