// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { Button, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import {
    FaCoins,
    FaPercentage,
    FaTrophy,
    FaUnlock,
    FaUsers,
    FaWallet,
} from 'react-icons/fa';

import Layout from '../../components/Layout';
import { useBlockNumber } from '../../services/eth';
import { useStakingPool } from '../../services/pool';
import { useCartesiToken } from '../../services/token';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import { useStaking } from '../../services/staking';
import CTSIText from '../../components/CTSIText';
import AddressText from '../../components/AddressText';
import StatsPanel from '../../components/home/StatsPanel';
import ActionsTab from '../../components/pools/ActionsTab';
import TransactionFeedback from '../../components/TransactionFeedback';

const Pool = () => {
    const router = useRouter();
    const { account, chainId } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const {
        pool,
        amount,
        amounts,
        stakedBalance,
        stakedShares,
        paused,
        releasedBalance,
        withdrawBalance,
        unstakeTimestamp,
        transaction,
        amountToShares,
        stake,
        unstake,
        withdraw,
        rebalance,
    } = useStakingPool(router.query.pool as string, account);

    const {
        balance,
        allowance,
        transaction: tokenTransaction,
        approve,
    } = useCartesiToken(account, router.query.pool as string, blockNumber);

    const staking = useStaking(router.query.pool as string);
    const stakingPool = useStakingPoolQuery(router.query.pool as string);

    const now = new Date();
    const stakeLocked =
        stakedBalance.gt(0) &&
        unstakeTimestamp &&
        unstakeTimestamp.getTime() > now.getTime();

    // indicator for effective stake
    const balanceUp = amounts && amounts.stake.gt(0);
    const balanceDown =
        amounts && (amounts.unstake.gt(0) || amounts.withdraw.gt(0));
    const colorEffective = balanceUp
        ? 'red.500'
        : balanceDown
        ? 'green.500'
        : undefined;

    // TODO: values tooltips

    const onUnstake = (amount?: BigNumber) => {
        if (amount) {
            // convert CTSI to shares
            unstake(amountToShares(amount));
        } else {
            // full unstake
            unstake(stakedShares);
        }
    };

    return (
        <Layout>
            <Head>
                <title>Cartesi - Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                px="6vw"
                py={5}
                justify="space-between"
                align="flex-end"
                bg="black"
                opacity={0.87}
                color="white"
            >
                <AddressText
                    address={stakingPool?.id}
                    chainId={chainId}
                    icon={FaUsers}
                >
                    <Text>Staking Pool</Text>
                </AddressText>
                <CTSIText
                    value={balance}
                    icon={FaWallet}
                    bg="black"
                    color="white"
                >
                    <Text bg="black" color="white">
                        Wallet Balance
                    </Text>
                </CTSIText>
                <CTSIText
                    value={stakedBalance}
                    icon={FaCoins}
                    bg="black"
                    color="white"
                >
                    <Text bg="black" color="white">
                        Staked Balance
                    </Text>
                </CTSIText>
                <CTSIText
                    value={releasedBalance}
                    icon={FaUnlock}
                    bg="black"
                    color="white"
                >
                    <Text bg="black" color="white">
                        Released Balance
                    </Text>
                </CTSIText>
            </HStack>
            {stakingPool &&
                account &&
                stakingPool.manager == account.toLowerCase() && (
                    <Link href={`/pools/${router.query.pool}/edit`}>
                        <EditIcon fontSize="xx-large" />
                    </Link>
                )}

            <VStack px="6vw" py={5} spacing={10}>
                <TransactionFeedback transaction={transaction}>
                    Sending transaction...
                </TransactionFeedback>
                <TransactionFeedback transaction={tokenTransaction}>
                    Sending transaction...
                </TransactionFeedback>
                <StatsPanel w="100%" align="flex-start">
                    <CTSIText icon={FaCoins} value={amount}>
                        <Text>Total Staked</Text>
                    </CTSIText>
                    <VStack>
                        <CTSIText
                            icon={FaCoins}
                            color={colorEffective}
                            value={staking.stakedBalance}
                        >
                            <Text color={colorEffective}>Effective Stake</Text>
                        </CTSIText>
                        {(balanceUp || balanceDown) && (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={rebalance}
                            >
                                update
                            </Button>
                        )}
                    </VStack>
                    <CTSIText
                        icon={FaTrophy}
                        value={BigNumber.from(
                            stakingPool?.user?.totalReward || 0
                        )}
                    >
                        <Text>Total Rewards</Text>
                    </CTSIText>
                    <CTSIText
                        icon={FaPercentage}
                        value={BigNumber.from(
                            stakingPool?.totalCommission || 0
                        )}
                    >
                        <Text>Commission</Text>
                    </CTSIText>
                </StatsPanel>
                <StakingDisclaimer key="readDisclaimer" />
            </VStack>

            <Wrap px="6vw" justify="space-between">
                <WrapItem>
                    <ActionsTab
                        minW={500}
                        maxW={500}
                        allowance={allowance}
                        paused={paused.valueOf()}
                        stakedAmount={stakedBalance}
                        stakedShares={stakedShares}
                        releasedBalance={releasedBalance}
                        withdrawBalance={withdrawBalance}
                        onApprove={(amount) => approve(pool.address, amount)}
                        onStake={(amount) => stake(amount)}
                        onUnstake={onUnstake}
                        onWithdraw={withdraw}
                    >
                        <Text>Test</Text>
                    </ActionsTab>
                </WrapItem>
            </Wrap>
        </Layout>
    );
};

export default Pool;
