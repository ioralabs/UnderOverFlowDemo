// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract UnderOverFlowDemo {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        uint oldBalance = balances[msg.sender];
        balances[msg.sender] += msg.value;
        assert(balances[msg.sender] >= oldBalance);
    }

    function transfer(address _to, uint256 _value) external {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        uint oldSenderBalance = balances[msg.sender];
        uint oldRecipientBalance = balances[_to];

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        assert(balances[msg.sender] <= oldSenderBalance);
        assert(balances[_to] >= oldRecipientBalance);
    }
}
