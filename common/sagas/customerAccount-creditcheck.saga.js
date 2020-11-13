import { ORDER_CONFIRMED, ORDER_PAID, ORDER_PLACED } from '../event-types';

export default {
  handlers: {
    Init: async ({ store }) => {
      await store.defineTable('OrderInfo', {
        indexes: { orderId: 'string' },
        fields: ['customerId'],
      });
      await store.defineTable('CustomerInfo', {
        indexes: { customerId: 'string' },
        fields: ['unpaidOrders'],
      });
    },

    [ORDER_PLACED]: async (
      { store, sideEffects },
      { aggregateId, payload: { customerId } }
    ) => {
      console.log(
        `[creditcheck] Recording order ${aggregateId} placed for customer ${customerId}. Side effects enabled: ${sideEffects.isEnabled}`
      );

      await store.insert('OrderInfo', { orderId: aggregateId, customerId });
    },

    [ORDER_CONFIRMED]: async ({ store, sideEffects }, { aggregateId }) => {
      console.log(
        `[creditcheck] Order ${aggregateId}  confirmed. Side effects enabled: ${sideEffects.isEnabled}`
      );
      const orderInfo = await store.findOne('OrderInfo', {
        orderId: aggregateId,
      });
      const customerInfo = await store.findOne('CustomerInfo', {
        customerId: orderInfo.customerId,
      });
      const unpaidOrders = customerInfo ? customerInfo.unpaidOrders + 1 : 1;

      console.log(
        `[creditcheck] Unpaid orders for customer ${orderInfo.customerId} now ${unpaidOrders}`
      );

      if (customerInfo) {
        await store.update(
          'CustomerInfo',
          { customerId: orderInfo.customerId },
          { $set: { unpaidOrders } }
        );
      } else {
        await store.insert('CustomerInfo', {
          customerId: orderInfo.customerId,
          unpaidOrders,
        });
      }

      // When the customer has three unpaid orders at once,
      // we declare the customer account "bad credit".
      // Perhaps this is not the best term, but it only means
      // that any further orders from this point onwards would need
      // manual confirmation by the boss.
      if (unpaidOrders >= 3) {
        console.log(
          `[creditcheck] Customer account ${orderInfo.customerId} now in bad credit`
        );

        await sideEffects.executeCommand({
          aggregateName: 'customerAccount',
          type: 'setCustomerAccountBadCreditState',
          aggregateId: orderInfo.customerId,
        });
      }
    },

    [ORDER_PAID]: async ({ store, sideEffects }, { aggregateId }) => {
      console.log(
        `[creditcheck] Order ${aggregateId}  paid. Side effects enabled: ${sideEffects.isEnabled}`
      );
      const orderInfo = await store.findOne('OrderInfo', {
        orderId: aggregateId,
      });
      const customerInfo = await store.findOne('CustomerInfo', {
        customerId: orderInfo.customerId,
      });
      const unpaidOrders = customerInfo.unpaidOrders - 1;
      console.log(
        `[creditcheck] Unpaid orders for customer ${orderInfo.customerId} now ${unpaidOrders}`
      );
      await store.update(
        'CustomerInfo',
        { customerId: orderInfo.customerId },
        { $set: { unpaidOrders } }
      );

      if (unpaidOrders < 3) {
        console.log(
          `[creditcheck] Customer account ${orderInfo.customerId} not in bad credit anymore`
        );
        await sideEffects.executeCommand({
          aggregateName: 'customerAccount',
          type: 'resetCustomerAccountBadCreditState',
          aggregateId: orderInfo.customerId,
        });
      }
    },
  },
};
