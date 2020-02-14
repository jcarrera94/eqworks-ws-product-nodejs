const SET_APP_DATA = 'SET_APP_DATA';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_APP_DATA:
      return {
        ...state,
        events: {
          ...state.events,
          hourly: action.hourly_events,
          daily: action.daily_events
        },
        stats: {
          ...state.stats,
          hourly: action.hourly_stats,
          daily: action.daily_stats
        },
        poi: action.poi
      }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export {
  reducer,
  SET_APP_DATA
}