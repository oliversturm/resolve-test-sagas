import {
  ORDER_PLACED,
  ORDER_MARKED_INVALID,
  ORDER_MARKED_ASKBOSS,
} from '../event-types';

export default {
  placeOrder: (
    order,
    { payload: { customer, lines } },
    { aggregateVersion }
  ) => {
    if (order.exists) throw new Error('Order exists');

    if (!customer) throw new Error('"customer" is required');
    if (!lines || !Array.isArray(lines) || lines.length <= 0)
      throw new Error('"lines" must be an array of order lines');

    return { type: ORDER_PLACED, payload: { customer, lines } };
  },

  markOrderInvalid: (order, { payload: { reason } }, { aggregateVersion }) => {
    if (!order.exists) throw new Error('Order does not exist');

    return { type: ORDER_MARKED_INVALID, payload: { reason } };
  },

  markOrderAskBoss: (order, { payload: { reason } }) => {
    if (!order.exists) throw new Error('Order does not exist');

    return { type: ORDER_MARKED_ASKBOSS, payload: { reason } };
  },
};
