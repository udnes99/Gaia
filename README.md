# Gaia - A proof of concept sustainability reporting blockchain application
This is a proof of concept implementation that I created as part of my master's thesis.


# Documentation
https://hyperledger.github.io/fabric-chaincode-node/main/api/


# Peer CLI
https://hyperledger-fabric.readthedocs.io/en/latest/commands/peerchaincode.html#peer-chaincode-invoke

# Test network
A test network can be setup by following the samples from Fabric which can be found here [here](https://github.com/hyperledger/fabric-samples).
The following commands assume a test network that has been setup with two organizations on a channel called *main*  using the scripts from `test-network` sample provided by fabric.

Remember to build and deploy the code before proceeding.


## Setup CLI (Org1)
1. From the working directory `test-network` in fabric samples set the following env variables:
2.  
```
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

## Setup CLI (Org2)
1. From the working directory `test-network`, set the following env variables:
2.  
```
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
```

## Invoke Chaincode
Using Peer Org 1 as the basis:

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C main -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```

Using Peer Org 2:

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C main -n basic --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org2.example.com/tls/ca.crt" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org1.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```

**Queries:**
`peer chaincode query -C main -n basic -c '{"Args":["GetAllAssets"]}'`



TODO: https://hyperledger-fabric.readthedocs.io/en/latest/secured_asset_transfer/secured_private_asset_transfer_tutorial.html


# Chaincode Examples


## View Activities
```
peer chaincode query -C main -n basic -c '{"Args":["Activity:getActivities"]}'
```
## Register Activity

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C main -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"Activity:registerActivity","Args":["{\"id\": \"123\", \"type\": \"ProduceAssets\", \"outcome\": {\"type\": \"GreenhouseGasEmitted\", \"gas_type\": 0, \"unit\": 0, \"magnitude\": 40}, \"assets\": {\"produced\": [{\"id\": 1, \"type\": \"Phone\", \"fractional\": false}, {\"id\": 2, \"type\": \"Phone\", \"fractional\": false}, {\"id\": 3, \"type\": \"Phone\", \"fractional\": false}]}}"]}'

```


**Transient**

```
export ACTIVITY_DETAILS=$(echo -n "{\"id\": \"123\", \"type\": \"ProduceAssets\", \"outcome\": {\"type\": \"GreenhouseGasEmitted\", \"gas_type\": 0, \"unit\": 0, \"magnitude\": 40}, \"assets\": {\"produced\": [{\"id\": 1, \"type\": \"Phone\", \"fractional\": false}, {\"id\": 2, \"type\": \"Phone\", \"fractional\": false}, {\"id\": 3, \"type\": \"Phone\", \"fractional\": false}]}}" | base64 | tr -d \\n)


peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C main -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"Activity:registerActivity","Args":[""]}' --transient "{\"payload\":\"$ACTIVITY_DETAILS\"}"
```

## View Assets
```
peer chaincode query -C main -n basic -c '{"Args":["Asset:getAssets"]}'
```

## View Sustainability Impact
```
peer chaincode query -C main -n basic -c '{"Args":["Asset:getDownstreamImpact", "<AssterId>"}'
```





## Propose Interaction:


```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C main -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"Interaction:proposeInteraction","Args":["{\"id\": \"interaction-1\", \"to\": \"Org2MSP\", \"activities\": [{\"id\": \"123\", \"type\": \"ProduceAssets\", \"outcome\": {\"type\": \"GreenhouseGasEmitted\", \"gas_type\": 0, \"unit\": 0, \"magnitude\": 40}, \"assets\": {\"produced\": [{\"id\": 1, \"type\": \"Phone\", \"fractional\": false},{\"id\":2, \"type\": \"Phone\", \"fractional\": false}, {\"id\": 3, \"type\": \"Phone\", \"fractional\": false}]}}]}"]}'
```


## View Interactions:

`peer chaincode query -C main -n basic -c '{"Args":["Interaction:getAllInteractions"]}'`





## Confirm Interaction: 

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C main -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"Interaction:confirmInteraction","Args":["{\"activities\":[{\"assets\":{\"produced\":[{\"fractional\":false,\"id\":1,\"type\":\"Phone\"},{\"fractional\":false,\"id\":2,\"type\":\"Phone\"},{\"fractional\":false,\"id\":3,\"type\":\"Phone\"}]},\"id\":\"123\",\"outcome\":{\"gas_type\":0,\"magnitude\":40,\"type\":\"GreenhouseGasEmitted\",\"unit\":0},\"type\":\"ProduceAssets\"}],\"from\":\"Org1MSP\",\"id\":\"interaction-1\",\"state\":0,\"to\":\"Org2MSP\"}"]}'
```


