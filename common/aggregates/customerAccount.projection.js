import { CUSTOMER_ACCOUNT_CREATED } from '../event-types';

export default {
  Init: () => ({}),
  [CUSTOMER_ACCOUNT_CREATED]: (state) => ({ ...state, exists: true }),
};
