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
});
