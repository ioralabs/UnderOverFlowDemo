# UnderOverFlowDemo

This is a simple demo project to demonstrate the concept of underflow and overflow in Solidity smart contracts.

## Contract

The contract in this demo project, `UnderOverFlowDemo`, keeps track of ether balances for each address and provides functionality to deposit ether and transfer ether from one account to another. The contract uses `require` to ensure that an account cannot transfer more ether than it has, which protects against underflows. 

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnderOverFlowDemo {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function transfer(address _to, uint256 _value) external {
        require(balances[msg.sender] >= _value, "Insufficient balance");

        balances[msg.sender] -= _value;
        balances[_to] += _value;
    }
}
```

## Tests

The tests in this demo project check that the contract correctly reverts transactions that would result in an underflow or overflow.

```solidity
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const chai = require("chai");
chai.use(require('chai-as-promised'))

describe("UnderOverFlowDemo", function () {
    let UnderOverFlowDemo, underOverFlowDemo, owner, attacker, to, overflowValue;

    beforeEach(async function () {
        [owner, attacker] = await ethers.getSigners();

        UnderOverFlowDemo = await ethers.getContractFactory("UnderOverFlowDemo");
        underOverFlowDemo = await UnderOverFlowDemo.deploy();
        await underOverFlowDemo.deployed();

        to = attacker.address;

        // 1 ether
        const value = ethers.utils.parseEther("1");

        // This should fail due to underflow
        await assert.isRejected(underOverFlowDemo.transfer(to, value), Error, "revert");

        // This should fail due to overflow
        overflowValue = ethers.constants.MaxUint256;
        await assert.isRejected(underOverFlowDemo.transfer(owner.address, overflowValue), Error, "revert");
    });

    it("should fail when underflow occurs", async function () {
        const balance = await underOverFlowDemo.balances(to);
        expect(balance).to.not.equal(ethers.utils.parseEther("1"));
    });

    it("should fail when overflow occurs", async function () {
        const balance = await underOverFlowDemo.balances(owner.address);
        expect(balance).to.not.equal(overflowValue);
    });
})
```

## Setup and Test

First, install the necessary dependencies:

```bash
yarn install
```

Then, to run the tests:

```bash
yarn hardhat test
```

## Changelog: Solidity 0.7 to 0.8

### Silent Changes of the Semantics

In Solidity 0.8, some existing code changes its behavior without the compiler specifically notifying about it. These changes include:

#### Arithmetic Operations

Arithmetic operations now revert on underflow and overflow. This change is intended to increase the readability of code by making overflow checks the default behavior, even though it may slightly increase gas costs.

If you want to utilize the previous wrapping behavior where the code execution wouldn't halt on overflow or underflow, you can use `unchecked { ... }`. Here's an example:

```solidity
unchecked {
    // Arithmetic operations that may underflow/overflow
}
