/**
 * Created by leon<silenceace@gmail.com> on 22/2/25.
 */
import { useEffect, useState } from 'react'
import { V2exObject, V2exAPI } from '../types'
import { useAppSelector } from './'

export const useTopic = ({ topicId }: { topicId: string }) => {
  const [topic, setTopic] = useState<V2exObject.Topic | undefined>(undefined)
  const v2ex = useAppSelector((_state: any) => _state.app.v2ex as V2exAPI.V2ex)

  useEffect(() => {
    const fetchTopic = async () => {
      const _topic = await v2ex.topic.get(topicId)
      setTopic(_topic)
    }
    fetchTopic()
  }, [topicId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    topic
  }
}