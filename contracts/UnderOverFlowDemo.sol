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
