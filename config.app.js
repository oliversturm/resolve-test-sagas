const appConfig = {
  aggregates: [
    {
      name: 'customerAccount',
      commands: 'common/aggregates/customerAccount.commands.js',
      projection: 'common/aggregates/customerAccount.projection.js',
    },
    {
      name: 'order',
      commands: 'common/aggregates/order.commands.js',
      projection: 'common/aggregates/order.projection.js',
    },
  ],
  readModels: [
    {
      name: 'read-model-name',
      projection: 'common/read-models/read-model-name.projection.js',
      resolvers: 'common/read-models/read-model-name.resolvers.js',
      connectorName: 'default',
    },
  ],
  viewModels: [
    {
      name: 'customerAccounts',
      projection: 'common/view-models/customerAccounts.projection.js',
      // serializeState: 'common/view-models/view-model-name.serialize_state.js',
      // deserializeState:
      //   'common/view-models/view-model-name.deserialize_state.js',
    },
    { name: 'orders', projection: 'common/view-models/orders.projection.js' },
  ],
  sagas: [
    {
      name: 'orderConfirmation',
      source: 'common/sagas/order-confirmation.saga.js',
      connectorName: 'default',
      schedulerName: 'scheduler',
    },
    {
      name: 'customerAccountCreditCheck',
      source: 'common/sagas/customerAccount-creditcheck.saga.js',
      connectorName: 'default',
      schedulerName: 'scheduler',
    },
  ],
  clientEntries: ['client/index.js'],
};

export default appConfig;
