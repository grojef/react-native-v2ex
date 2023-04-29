import {
    Action,
    APP_AUTH,
    APP_LOGOUT,
    IState,
    MEMBER_LIKE_TOPICS,
    MEMBER_PROFILE,
    MEMBER_READ_TOPIC,
    MEMBER_SATE_SETTING,
    MEMBER_TOPICS,
    MEMBER_UNLIKE_TOPICS
} from '../types'

const INITIAL_STATE: IState.MemberState = {
  refreshing: false,
  interestNodes: [],
  followPeoples: [],
  likeTopics: []
}

export default (state: IState.MemberState = INITIAL_STATE, action: Action): IState.MemberState => {
  switch (action.type) {
    case MEMBER_LIKE_TOPICS:
      return {
        ...state,
        likeTopics: state.likeTopics.concat(
          state.likeTopics && state.likeTopics.findIndex((v) => v.id === action.payload.id) >= 0 ? [] : action.payload
        )
      }
    case MEMBER_UNLIKE_TOPICS:
      return {
        ...state,
        likeTopics: state.likeTopics.filter((v) => v.id !== action.payload.id)
      }
    case MEMBER_SATE_SETTING:
      return { ...state, ...action.payload }
    case MEMBER_TOPICS:
      return { ...state, topics: action.payload }
    case APP_AUTH:
      return { ...state, token: action.payload }
    case APP_LOGOUT:
      return { ...INITIAL_STATE }
    case MEMBER_PROFILE:
      return { ...state, profile: action.payload }
    case MEMBER_READ_TOPIC:
      const readed_topics = (state.readedTopics ?? []).find((t) => t.id === action.payload.id)
        ? state.readedTopics
        : [action.payload].concat(state.readedTopics || [])
      return { ...state, readedTopics: readed_topics }
    default:
      return state
  }
}
