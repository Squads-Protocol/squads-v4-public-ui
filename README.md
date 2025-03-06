### This repo has been deprecated ###
Please use https://github.com/Squads-Protocol/public-v4-client for the simplified repo

# Squads V4 public UI

This repository contains the code for a source available Squads V4 user interface.

## Usage on local device

### Requirements

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS](https://nodejs.org/en/download)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Installation

First, clone this repository to a folder on your device.

```
git clone https://github.com/Squads-Protocol/squads-v4-public-ui.git .
```

Then, install the required dependencies and build the app.

```
yarn && yarn build
```

### Start app locally

```
yarn start
```

## Configuration

There are multiple configuration options available which are stored in the cookies of the application, but can also be set via the UI.

- RPC url

Default: https://api.mainnet-beta.solana.com

Cookie name: x-rpc-url

- Multisig address

Cookie name: x-multisig

- Vault Index

Cookie name: x-vault-index

## Disclaimer

Use this code at your own risk. 

By using the provided code, you agree that the maintainer of this repository will not be help responsible for any type of issue that may have occured.
