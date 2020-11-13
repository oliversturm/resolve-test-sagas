import {
  ORDER_PLACED,
  ORDER_MARKED_INVALID,
  ORDER_MARKED_ASKBOSS,
  ORDER_CONFIRMED,
  ORDER_PAID,
} from '../event-types';

export default {
  placeOrder: (order, { payload: { customerId, lines } }) => {
    if (order.exists) throw new Error('Order exists');

    if (!customerId) throw new Error('"customerId" is required');
    if (!lines || !Array.isArray(lines) || lines.length <= 0)
      throw new Error('"lines" must be an array of order lines');

    return { type: ORDER_PLACED, payload: { customerId, lines } };
  },

  markOrderInvalid: (order, { payload: { reason } }) => {
    if (!order.exists) throw new Error('Order does not exist');

    return { type: ORDER_MARKED_INVALID, payload: { reason } };
  },

  markOrderAskBoss: (order, { payload: { reason } }) => {
    if (!order.exists) throw new Error('Order does not exist');

    return { type: ORDER_MARKED_ASKBOSS, payload: { reason } };
  },

  confirmOrder: (order) => {
    if (!order.exists) throw new Error('Order does not exist');

    // This check is not so great, perhaps even bad - leaving it in
    // as a placeholder to point out that the state is part of the aggregate
    // and we can decide on its basis.
    if (order.state === 'confirmed')
      throw new Error('Order is already confirmed');

    return { type: ORDER_CONFIRMED };
  },

  markOrderPaid: (order) => {
    if (!order.exists) throw new Error('Order does not exist');
    if (order.state !== 'confirmed') throw new Error('Order is not confirmed');
    return { type: ORDER_PAID };
  },
};
