import {
  ORDER_PLACED,
  ORDER_MARKED_INVALID,
  ORDER_MARKED_ASKBOSS,
  ORDER_CONFIRMED,
} from '../event-types';

export default {
  Init: () => ({ state: 'new' }),
  [ORDER_PLACED]: (state) => ({ ...state, exists: true }),
  [ORDER_MARKED_INVALID]: (state) => ({ ...state, state: 'invalid' }),
  [ORDER_MARKED_ASKBOSS]: (state) => ({ ...state, state: 'askBoss' }),
  [ORDER_CONFIRMED]: (state) => ({ ...state, state: 'confirmed' }),
};
