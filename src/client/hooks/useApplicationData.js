import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { reducer, SET_APP_DATA } from './application';

export function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    events: {
      hourly: [],
      daily: []
    },
    stats: {
      hourly: [],
      daily: []
    },
    poi: []
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/events/hourly'),
      axios.get('/api/events/daily'),
      axios.get('/api/stats/hourly'),
      axios.get('/api/stats/daily'),
      axios.get('/api/poi')
    ]).then(all => {
      dispatch({
        type: SET_APP_DATA,
        hourly_events: all[0].data,
        daily_events: all[1].data,
        hourly_stats: all[2].data,
        daily_stats: all[3].data,
        poi: all[4].data
      });
    }).catch(err => {
      console.error(err);
    })
  }, []);

  return { state };

}
