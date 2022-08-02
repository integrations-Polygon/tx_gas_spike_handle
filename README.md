
# GAS SPIKE AND PENDING/STUCK TRANSACTION DEMO

​
This small project demo focuses on how to use custom gas to avoid any gas spike and how to cope with pending/stuck transactions.


## Getting Started

* Clone this repository

  git clone https://github.com/integrations-Polygon/tx_gas_spike_handle.git

* Navigate to project

  cd tx_management

* Install Dependencies

  npm Install


## Usage

* Here you can find three scripts named gas_spike,pending_tx and stuck_tx under scripts folder.Deploy them separately to understand their purpose differently.

* For gas_spike.js

    1.Firstly put your private key in private key variable in script

    2.Change custom gas according to your choice and run script.

    3.The code will run until live gas price comes down or get equal to your custom gas.

    4.Once gas price comes down to or equal to custom gas, transaction will be sent.


* For pending_tx.js

    1.Firstly put your private key in private key variable in script

    2.This script first send the transaction with very less gas fee to move transaction in pending state and after that raise the gas price according to live gas.

    3 .Once the gas price raised to the max, transaction will be send.

* For stuck_tx.js

    1.Firstly put your private key in private key variable in script

    2.Put stuck transactin hash in stuck_txhash variable in script.

    3.Now first the code test the transaction status and in case it is still stuck, transaction will be sent again with live gas price along with latest nonce.

    4.It will recheck the status and provide transaction hash of successful transaction.


