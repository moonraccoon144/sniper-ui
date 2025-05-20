import { useState } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';

export default function SniperUI() {
  const [token, setToken] = useState('');
  const [slippage, setSlippage] = useState('10');
  const [minLiquidity, setMinLiquidity] = useState('1');
  const [block, setBlock] = useState('');
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState('');

  const abi = [
    'function setToken(address _token) external',
    'function setSlippage(uint _percent) external',
    'function setMinLiquidity(uint _amount) external',
    'function setSnipeBlock(uint _block) external',
    'function simulateHoneypot(uint testAmount) public returns (bool)',
    'function snipe() external',
  ];

  const contractAddress = '0x3D612658C137cCFeCd0E23F4B829594B77357a60'; // Replace this with your actual contract

  const connect = async () => {
    try {
      if (!window.ethereum) {
        alert('No wallet detected. Please install Rabby or MetaMask.');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const c = new Contract(contractAddress, abi, signer);
      const userAddress = await signer.getAddress();

      setContract(c);
      setStatus(`Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`);
    } catch (err) {
      console.error('Connection error:', err);
      setStatus('Failed to connect wallet.');
    }
  };

  const updateSettings = async () => {
    try {
      setStatus('Setting parameters...');
      await contract.setToken(token);
      await contract.setSlippage(Number(slippage));
      await contract.setMinLiquidity(parseEther(minLiquidity));
      if (block) await contract.setSnipeBlock(Number(block));
      setStatus('Settings updated');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const simulate = async () => {
    try {
      setStatus('Simulating honeypot...');
      const result = await contract.simulateHoneypot(parseEther('0.01'));
      setStatus(result ? 'Safe' : 'Honeypot!');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const executeSnipe = async () => {
    try {
      setStatus('Sniping...');
      const tx = await contract.snipe();
      await tx.wait();
      setStatus('Sniped successfully!');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2>Ethereum Sniper Bot UI</h2>
      <button onClick={connect}>Connect Wallet</button>

      <div style={{ marginTop: '20px' }}>
        <label>Token Address</label><br />
        <input value={token} onChange={e => setToken(e.target.value)} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Slippage (%)</label><br />
        <input value={slippage} onChange={e => setSlippage(e.target.value)} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Minimum Liquidity (ETH)</label><br />
        <input value={minLiquidity} onChange={e => setMinLiquidity(e.target.value)} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Snipe Block (optional)</label><br />
        <input value={block} onChange={e => setBlock(e.target.value)} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={updateSettings}>Set Parameters</button>
        <button onClick={simulate} style={{ marginLeft: '10px' }}>Simulate Honeypot</button>
        <button onClick={executeSnipe} style={{ marginLeft: '10px' }}>Snipe Now</button>
      </div>

      <div style={{ marginTop: '20px', fontStyle: 'italic' }}>{status}</div>
    </div>
  );
}
