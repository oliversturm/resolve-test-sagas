import {
  CUSTOMER_ACCOUNT_CREATED,
  CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET,
  CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET,
} from '../event-types';

export default {
  Init: () => [],

  [CUSTOMER_ACCOUNT_CREATED]: (state, { aggregateId: id, payload: { name } }) =>
    state.concat({ id, name }),

  [CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET]: (state, { aggregateId: id }) =>
    state.map((c) => (c.id === id ? { ...c, state: 'ok' } : c)),

  [CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET]: (state, { aggregateId: id }) =>
    state.map((c) => (c.id === id ? { ...c, state: 'badCredit' } : c)),
};
