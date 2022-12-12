# Wrapped TON contract

Basic implementation of WTON contract.

## Motivation

Interaction with different kinds of assets requires additional conditional logic.
This contract unifies interaction with assets and splits assets from paying for gas.

## Summary

The contract is compatible to [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and [TEP-89](https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md) standards.

Implementation is based on locking TON coins on minter contract on minting jettons and releasing TON on burning jettons.

The contract implement WTON specific operations:

```tl-b
burn_notification_ext#84106950 query_id:uint64 amount:Coins
                           sender:MsgAddress response_destination:MsgAddress
                           custom_payload:(Maybe ^Cell) = InternalMsgBody;

mint#864e0716 query_id:uint64 amount:Coins recipient:MsgAddress forward_amount:Coins
              forward_payload:(Maybe ^Cell) return_excesses_to:MsgAddress = InternalMsgBody;

release#71c6af6b query_id:uint64 custom_payload:(Maybe ^Cell) = InternalMsgBody;
```

## Use Cases

### Wrapping

It reserves `amount + minimal_balance()` TON on the minter contract and sends the rest to a WTON wallet of `recipient` within `internal_transfer` message.
One of the most important things is an ability to attach `forward_amount` and `forward_payload` to build a pipeline of transactions.

The message should be rejected if:

- `msg_value` is less than `amount + forward_amount + gas_fee`
- `recipient` is in different workchain than the minter

### Unwrapping

In order to unwrap tokens from jettons to TON, `burn` operation should be used.
Current relies on existing operation `burn` (including `custom_payload`) but uses a new operation `burn_notification_ext` instead of `burn_notification`.
The only reason of replacing `burn_notification` by a new `burn_notification_ext` is inability to attach a `custom_payload`.

After burning, a jetton wallet sends `burn_notification_ext` to a minter.
As soon as a minter receive `burn_notification_ext` message, it decreased `total_supply` by `amount`,
reserves `total_supply + minimal_balance()` and sends a message `release` to `response_destination` attaching the rest of TON and optional `custom_payload`.

The message `burn` should be rejected if:

- `response_destination` is not specified
- `amount` is less than jetton balance of jetton wallet
- `msg_sender` is not an owner of jetton wallet
- `msg_value` is not enough for handling both messages `burn` and `burn_notification_ext`
