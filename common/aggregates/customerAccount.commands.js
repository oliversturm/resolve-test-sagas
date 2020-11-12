import {
  CUSTOMER_ACCOUNT_CREATED,
  CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET,
  CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET,
} from '../event-types';

export default {
  createCustomerAccount: (
    customer,
    { payload: { name } },
    { aggregateVersion }
  ) => {
    if (customer.exists) throw new Error('Customer exists');

    if (!name) throw new Error('"name" is required');

    return { type: CUSTOMER_ACCOUNT_CREATED, payload: { name } };
  },

  setCustomerAccountBadCreditState: (customer, _, { aggregateVersion }) => {
    if (!customer.exists) throw new Error('Customer does not exist');

    return { type: CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_SET };
  },

  resetCustomerAccountBadCreditState: (customer, _, { aggregateVersion }) => {
    if (!customer.exists) throw new Error('Customer does not exist');

    return { type: CUSTOMER_ACCOUNT_BAD_CREDIT_STATE_RESET };
  },
};
