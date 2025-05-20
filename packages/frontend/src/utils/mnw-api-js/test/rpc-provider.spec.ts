import { expect, test } from '@jest/globals';

import { RpcProvider } from '..';

async function checkConnection(rpcProvider) {
    const result = await rpcProvider.sendJsonRpc('gas_price', [null]);

    expect(result.gas_price).toBeTruthy();
}

test(
    'passing url should work (deprecated method)',
    async () => {
        //--https://rpc.mainnet.near.org
        const rpcProvider = new RpcProvider('http://206.238.196.207:3030/');

        await checkConnection(rpcProvider);
    },
    60 * 1000
);

test(
    'passing ConnectionInfo should work (original method)',
    async () => {
        const rpcProvider = new RpcProvider({ url: 'http://206.238.196.207:3030/' });

        await checkConnection(rpcProvider);
    },
    30 * 1000
);

test(
    'wrong ConnectionInfo should throw error (original method)',
    async () => {
        const rpcProvider = new RpcProvider({ url: 'https://wrong-url.com/' });

        try {
            const result = await rpcProvider.sendJsonRpc('gas_price', [null]);

            expect(result).toBeUndefined();
        } catch (err) {
            expect(err.type).toBe('RetriesExceeded');
        }
    },
    60 * 1000
);

// note: no longer valid, now rpc gas price always return default value
// test(
//     'wrong methods / params will throw error instead of keeping on retry (new method)',
//     async () => {
//         const rpcProvider = new RpcProvider(
//             new RpcRotator([
//                 {
//                     id: 'near',
//                 },
//                 {
//                     id: 'custom',
//                     data: {
//                         url: 'https://wrong-url.com/',
//                     },
//                 },
//             ])
//         );

//         try {
//             const result = await rpcProvider.sendJsonRpc('gas_price', ['wrong params']);

//             expect(result).toBeUndefined();
//         } catch (err) {
//             expect(err.type).not.toBe('RetriesExceeded');
//         }
//     },
//     30 * 1000
// );
