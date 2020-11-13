#!/bin/bash

echo '{"aggregateName":"order","type":"placeOrder","aggregateId":"order-1","payload":{"customerId":"cust-1","lines":[{"value":111}]}}' | http POST http://127.0.0.1:3000/api/commands
echo '{"aggregateName":"order","type":"placeOrder","aggregateId":"order-2","payload":{"customerId":"cust-1","lines":[{"value":222}]}}' | http POST http://127.0.0.1:3000/api/commands
echo '{"aggregateName":"order","type":"placeOrder","aggregateId":"order-3","payload":{"customerId":"cust-1","lines":[{"value":333}]}}' | http POST http://127.0.0.1:3000/api/commands
