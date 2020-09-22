// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Staking } from '../contracts/Staking';
import { StakingFactory } from '../contracts/StakingFactory';
import { networks } from '../utils/networks';
import { BigNumber, BigNumberish } from 'ethers';

export const useStaking = () => {
    const { library, chainId, account } = useWeb3React<Web3Provider>();
    const [staking, setStaking] = useState<Staking>();

    const [stakedBalance, setStakedBalance] = useState<BigNumber>(BigNumber.from(0));
    const [maturingTimestamp, setMaturingTimestamp] = useState<Date>(null);
    const [releasingTimestamp, setReleasingTimestamp] = useState<Date>(null);
    const [maturingBalance, setMaturingBalance] = useState<BigNumber>(BigNumber.from(0));
    const [releasingBalance, setReleasingBalance] = useState<BigNumber>(BigNumber.from(0));
    
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the Staking, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            try {
                const deployment = require(`@cartesi/pos/deployments/${network}/StakingImpl.json`);
                const address = deployment?.address;
                if (address) {
                    console.log(`Attaching Staking to address '${address}' deployed at network '${chainId}'`);
                    setStaking(StakingFactory.connect(address, library.getSigner()));
                } else {
                    setError(`Staking not deployed at network '${chainId}'`);
                }
            } catch (e) {
                setError(`Staking not deployed at network '${chainId}'`);
            }
        }
    }, [library, chainId]);

    const updateState = () => {
        if (staking && account) {
            try {
                setError('');
                staking.getStakedBalance(account).then(setStakedBalance);
                staking.getMaturingTimestamp(account).then(value => setMaturingTimestamp(new Date(value.toNumber() * 1000)));
                staking.getReleasingTimestamp(account).then(value => setReleasingTimestamp(new Date(value.toNumber() * 1000)));
                staking.getMaturingBalance(account).then(setMaturingBalance);
                staking.getReleasingBalance(account).then(setReleasingBalance);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    useEffect(() => {
        if (staking && account) {
            updateState();
        }
    }, [staking, account]);

    const stake = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.stake(amount);

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const unstake = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.unstake(amount);

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const withdraw = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.withdraw(amount);

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    return {
        staking,
        submitting,
        error,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        stake,
        unstake,
        withdraw
    };
};