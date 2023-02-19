import {
    Action, APP_CACHE_ADD_DICT,
    APP_CACHE_ADD_MEMBER,
    APP_CACHE_ADD_NODE, APP_CACHE_DELAY_TIME,
    APP_CACHE_MEMBER_FOLLOWING,
    APP_CACHE_MEMBER_INTEREST_NODES,
    APP_CACHE_MEMBER_LIKE_TOPICS,
    APP_CACHE_RESET,
    APP_CACHE_RESET_MEMBERS,
    APP_CACHE_RESET_NODES,
    APP_LOGOUT,
    IState,
    MEMBER_PROFILE
} from '../types'

const INITIAL_STATE: IState.CacheState = {
    members: [],
    nodes: [],
    dict: {},
    membersFollowing: {0: undefined},
    membersInterestNodes: {0: undefined},
    membersLikeTopics: {0: undefined},
    counter: 0
}

export default (state: IState.CacheState = INITIAL_STATE, action: Action): IState.CacheState => {
    switch (action.type) {
        case MEMBER_PROFILE:
            return {...state, currentSessionMember: action.payload}
        case APP_LOGOUT:
            return {...state, currentSessionMember: undefined}
        case APP_CACHE_ADD_MEMBER:
            const members = state.members
            return {...state, members}
        case APP_CACHE_ADD_NODE:
            const nodes = action.payload;
            return {...state, dict: nodes}
        case APP_CACHE_MEMBER_INTEREST_NODES:
            state.membersInterestNodes[state.currentSessionMember?.user.userId ?? 0] = action.payload
            return {...state}
        case APP_CACHE_MEMBER_LIKE_TOPICS:
            state.membersLikeTopics[state.currentSessionMember?.user.userId ?? 0] = action.payload
            return {...state}
        case APP_CACHE_MEMBER_FOLLOWING:
            state.membersFollowing[state.currentSessionMember?.user.userId ?? 0] = action.payload
            return {...state}
        case APP_CACHE_RESET_MEMBERS:
            return {...state, members: []}
        case APP_CACHE_RESET_NODES:
            return {...state, nodes: []}
        case APP_CACHE_RESET:
            return {...INITIAL_STATE}
        case APP_CACHE_DELAY_TIME:
            return {...state, counter: action.payload}
        case APP_CACHE_ADD_DICT:
            const dict = action.payload;
            return {...state, dict: dict}
        default:
            return state
    }
}
