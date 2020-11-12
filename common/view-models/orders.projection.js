import {
  ORDER_PLACED,
  ORDER_MARKED_INVALID,
  ORDER_MARKED_ASKBOSS,
} from '../event-types';

export default {
  Init: () => [],

  [ORDER_PLACED]: (state, { aggregateId: id, payload: { customer, lines } }) =>
    state.concat({ id, customer, state: 'new' }),

  [ORDER_MARKED_INVALID]: (state, { aggregateId: id, payload: { reason } }) =>
    state.map((o) =>
      o.id === id ? { ...o, state: 'invalid', lastStateDetail: reason } : o
    ),

  [ORDER_MARKED_ASKBOSS]: (state, { aggregateId: id, payload: { reason } }) =>
    state.map((o) =>
      o.id === id ? { ...o, state: 'askboss', lastStateDetail: reason } : o
    ),
};
