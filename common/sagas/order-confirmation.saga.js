import {
  ORDER_PLACED,
  CUSTOMER_ACCOUNT_CREATED,
  CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET,
  CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET,
} from '../event-types';

export default {
  handlers: {
    Init: async ({ store }) => {
      await store.defineTable('CustomerAccounts', {
        indexes: { id: 'string' },
        fields: ['state'],
      });
    },

    [CUSTOMER_ACCOUNT_CREATED]: async (
      { store, sideEffects },
      { aggregateId }
    ) => {
      console.log(
        `[order-confirmation] CUSTOMER_ACCOUNT_CREATED, enabled=${sideEffects.isEnabled}`
      );
      await store.insert('CustomerAccounts', {
        id: aggregateId,
        state: 'ok',
      });
    },

    [CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET]: async (
      { store },
      { aggregateId: id }
    ) => {
      console.log(
        `[order-confirmation] CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET (${id})`
      );
      await store.update('CustomerAccounts', { id }, { $set: { state: 'ok' } });
    },

    [CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET]: async (
      { store },
      { aggregateId: id }
    ) => {
      console.log(
        `[order-confirmation] CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET (${id})`
      );
      await store.update(
        'CustomerAccounts',
        { id },
        { $set: { state: 'badCredit' } }
      );
    },

    [ORDER_PLACED]: async (
      { store, sideEffects },
      { aggregateId, payload: { customerId, lines } }
    ) => {
      console.log('[order-confirmation] ORDER_PLACED');
      // We should find a customer account
      const customerAccount = await store.findOne('CustomerAccounts', {
        id: customerId,
      });
      if (!customerAccount) {
        console.log(
          `[order-confirmation] No customer account found for ${customerId}`
        );
        await sideEffects.executeCommand({
          aggregateName: 'order',
          type: 'markOrderInvalid',
          aggregateId,
          payload: { reason: 'Invalid customer reference' },
        });
        return;
      }
      // The customer account should be in state 'ok'
      if (customerAccount.state !== 'ok') {
        console.log(
          `[order-confirmation] Customer account ${customerId} is not in "ok" state`
        );
        await sideEffects.executeCommand({
          aggregateName: 'order',
          type: 'markOrderAskBoss',
          aggregateId,
          payload: { reason: 'Customer account state is not "ok"' },
        });
        return;
      }

      // The total value of the order should not surpass a limit
      // I know that lines is a non-empty array
      const orderValue = lines.reduce((r, { value }) => {
        const f = parseFloat(value);
        return f ? r + f : r;
      }, 0);
      if (orderValue > 1000) {
        console.log(
          `[order-confirmation] Order value for order ${aggregateId} is too high, asking boss`
        );
        await sideEffects.executeCommand({
          aggregateName: 'order',
          type: 'markOrderAskBoss',
          aggregateId,
          payload: { reason: 'Order value seems high' },
        });
        return;
      }

      // Seems that all is good with the order, so we auto-confirm it.
      // Alternatively this can be done by the boss after they have
      // manually checked whatever they need to check.
      console.log(
        `[order-confirmation] All good with order for customer ${customerId}, details ${JSON.stringify(
          customerAccount
        )}`
      );

      await sideEffects.executeCommand({
        aggregateName: 'order',
        type: 'confirmOrder',
        aggregateId,
      });
    },
  },
};
