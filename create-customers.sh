#!/bin/bash

echo '{"aggregateName":"customerAccount","type":"createCustomerAccount","aggregateId":"cust-1","payload":{"name":"Oli"}}' | http POST http://127.0.0.1:3000/api/commands
echo '{"aggregateName":"customerAccount","type":"createCustomerAccount","aggregateId":"cust-2","payload":{"name":"Jim"}}' | http POST http://127.0.0.1:3000/api/commands

