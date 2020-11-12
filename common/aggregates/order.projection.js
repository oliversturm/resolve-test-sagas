import { ORDER_PLACED } from '../event-types';

export default {
  Init: () => ({}),
  [ORDER_PLACED]: (state) => ({ ...state, exists: true }),
};
