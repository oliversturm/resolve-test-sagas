import {
  ORDER_PLACED,
  ORDER_MARKED_INVALID,
  ORDER_MARKED_ASKBOSS,
  ORDER_CONFIRMED,
  ORDER_PAID,
} from '../event-types';

export default {
  Init: () => [],

  [ORDER_PLACED]: (
    state,
    { aggregateId: id, payload: { customerId, lines } }
  ) => state.concat({ id, customerId, state: 'new', lines }),

  [ORDER_MARKED_INVALID]: (state, { aggregateId: id, payload: { reason } }) =>
    state.map((o) =>
      o.id === id ? { ...o, state: 'invalid', lastStateDetail: reason } : o
    ),

  [ORDER_MARKED_ASKBOSS]: (state, { aggregateId: id, payload: { reason } }) =>
    state.map((o) =>
      o.id === id ? { ...o, state: 'askboss', lastStateDetail: reason } : o
    ),

  [ORDER_CONFIRMED]: (state, { aggregateId: id }) =>
    state.map((o) =>
      o.id === id ? { ...o, state: 'confirmed', lastStateDetail: '' } : o
    ),

  [ORDER_PAID]: (state, { aggregateId: id }) =>
    state.map((o) =>
      o.id === id ? { ...o, state: 'paid', lastStateDetail: '' } : o
    ),
};
