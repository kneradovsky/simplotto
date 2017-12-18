Using network 'development'.


[0m[0m
[0m  Contract: Simplotoken[0m
{ tx: '0xbbee2bc871335b414ad0d1d9eb8281e2e917b2ac9e9d958bed1ade133f8469c0',
  receipt: 
   { transactionHash: '0xbbee2bc871335b414ad0d1d9eb8281e2e917b2ac9e9d958bed1ade133f8469c0',
     transactionIndex: 0,
     blockHash: '0x4042c2f927d6a8332cf5f87a690368dfb0902dfd5efef158594f88ddbedd977f',
     blockNumber: 263,
     gasUsed: 23987,
     cumulativeGasUsed: 23987,
     contractAddress: null,
     logs: [],
     status: 1 },
  logs: [] }
  [31m  1) should put funds on the self account[0m
    > No events were emitted
  [32m  √[0m[90m check owner[0m
  [31m  2) send tokens[0m
    > No events were emitted
  [31m  3) buy tickets[0m
    > No events were emitted
0x627306090abab3a6e1400e9345bc60c78a8bef57
0xf17f52151ebef6c7334fad080c5704d77216b732
0xeb6e71bfb760bd0bbdd3c0a6466fbc6bb9608e8e
{ [String: '99969264000000000000'] s: 1, e: 19, c: [ 999692, 64000000000000 ] }
{ [String: '0'] s: 1, e: 0, c: [ 0 ] }
  [32m  √[0m[90m buy tokens[0m[31m (7825ms)[0m


[92m [0m[32m 2 passing[0m[90m (9s)[0m
[31m  3 failing[0m

[0m  1) Contract: Simplotoken should put funds on the self account:
[0m[31m     AssertionError: INITIAL SUPPLY won't load to the contract account: expected '1000000' to equal 500000[0m[90m
      at Simplotoken.deployed.then.then (test\lotterryBuySellTests.js:14:19)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:169:7)
[0m
[0m  2) Contract: Simplotoken send tokens:
[0m[31m     Error: VM Exception while processing transaction: revert[0m[90m
      at Object.InvalidResponse (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:41484:16)
      at C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:328866:36
      at C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:324536:9
      at XMLHttpRequest.request.onreadystatechange (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:327565:7)
      at XMLHttpRequestEventTarget.dispatchEvent (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176407:18)
      at XMLHttpRequest._setReadyState (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176697:12)
      at XMLHttpRequest._onHttpResponseEnd (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176852:12)
      at IncomingMessage.<anonymous> (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176812:24)
[0m
[0m  3) Contract: Simplotoken buy tickets:
[0m[31m     Error: VM Exception while processing transaction: revert[0m[90m
      at Object.InvalidResponse (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:41484:16)
      at C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:328866:36
      at C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:324536:9
      at XMLHttpRequest.request.onreadystatechange (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:327565:7)
      at XMLHttpRequestEventTarget.dispatchEvent (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176407:18)
      at XMLHttpRequest._setReadyState (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176697:12)
      at XMLHttpRequest._onHttpResponseEnd (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176852:12)
      at IncomingMessage.<anonymous> (C:\Users\neradovskiy_kl\AppData\Roaming\npm\node_modules\truffle\build\cli.bundled.js:176812:24)
[0m


