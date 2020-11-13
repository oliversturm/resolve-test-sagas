#!/bin/bash

echo '{"aggregateName":"order","type":"placeOrder","aggregateId":"order-extra-1","payload":{"customerId":"cust-1","lines":[{"value":999}]}}' | http POST http://127.0.0.1:3000/api/commands
