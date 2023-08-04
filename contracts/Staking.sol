// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable{
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
    }
 
}

contract Staking is Ownable { // them function deposit / rescueStuck ( rut tien Owner)
    using SafeMath for uint256;

    IERC20 public stakingToken;

    //tra ve sl stake
    mapping(address => uint256) public stakeAmount;
    //tra ve tg stake
    mapping(address => uint256) public stakeTime;
    //tra ve tien lai
    mapping(address => uint256) public rewardAmount;

    mapping(address => uint256) public lastTimeUpdateReward;

    event Stake(address stakerAddress, uint256 amount, uint256 stakeTime);// stake

    uint256 public percent = 1; //0,0001% => 0,00001 => muon 100000

    constructor(address tokenAddress) {
        stakingToken = MyToken(tokenAddress);
    }

    function stake(uint256 amount) external onlyOwner{
        require(amount > 0, "Cannot stake 0");

        updateReward(msg.sender);
        stakeAmount[msg.sender] += amount;
        stakeTime[msg.sender] = block.timestamp;
        stakingToken.transferFrom(msg.sender, address(this), amount);// transferFrom su dung khi nap tien
        emit Stake(msg.sender, amount, block.timestamp);
    }

    function unstake() external onlyOwner{
        address account = msg.sender;
        require(stakeAmount[account] > 0, "No staked amount");
        withdraw();
        uint256 amount = stakeAmount[account];
        stakeAmount[account] = 0;
        stakingToken.transfer(account, amount); // transfer su dung khi rut tien
    }

    //rut tien
    function withdraw() public {
        updateReward(msg.sender);
        
        uint256 reward = rewardAmount[msg.sender];
        require(reward > 0, "No reward to claim");
        stakingToken.transfer(msg.sender, reward);
        rewardAmount[msg.sender] = 0;
    }

    //
    function updateReward(address account) internal {
        if (account != address(0)) {
            uint256 reward = calculateReward(account);
            //cap nhat lai rewardAmount
            rewardAmount[account] += reward;
            lastTimeUpdateReward[msg.sender] = block.timestamp;
        }
    }

    function calculateReward(address account) public view returns (uint256) {
        if (stakeAmount[account] == 0) {
            return 0;
        }else{
            uint256 duration = block.timestamp - lastTimeUpdateReward[account];
            return duration * 1 * stakeAmount[account] / 100 /1000;
        }   
    }

}