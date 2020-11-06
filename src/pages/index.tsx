// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Row, Col } from 'antd';
import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';
import { useMarketInformation } from '../services/market';

import styles from './index.module.scss';

const Home = () => {
    const {
        marketInformation,
        error: marketInfomationError,
    } = useMarketInformation();

    return (
        <Layout>
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Row className={styles.headerSection}>
                {!marketInfomationError && (
                    <>
                        <Col xs={24} md={8} lg={4}>
                            <div className="caption white-text">CTSI Price</div>
                            <div className="info-text-sm dark-white-text">
                                {`$${marketInformation.price} USD`}
                            </div>
                        </Col>

                        <Col xs={24} md={8} lg={4}>
                            <div className="caption white-text">
                                CTSI Market Cap
                            </div>
                            <div className="info-text-sm dark-white-text">
                                {`$${marketInformation.marketCap} USD`}
                            </div>
                        </Col>

                        <Col xs={24} md={8} lg={4}>
                            <div className="caption white-text">
                                Circ. Supply
                            </div>
                            <div className="info-text-sm dark-white-text">
                                {`${marketInformation.circulatingSupply} CTSI`}
                            </div>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <div className="sub-title-2 white-text">
                                <img src="/images/wallet.png" />
                                &nbsp; Wallet Balance
                            </div>
                            <div className="info-text-md dark-white-text">
                                {`1,000,000.12 `}
                                <span className="caption">CTSI</span>
                            </div>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <div className="sub-title-2 white-text">
                                <img src="/images/staked.png" />
                                &nbsp; Staked Balance
                            </div>
                            <div className="info-text-md dark-white-text">
                                {`994,000 `}
                                <span className="caption">CTSI</span>
                            </div>
                        </Col>
                    </>
                )}
            </Row>

            <div className={styles.dashboardSection}>
                <Row className={styles.dashboardContent}>
                    <Col span={6} className={styles.dashboardItem}>
                        <div className="sub-title-1"># Active Nodes</div>
                        <div className="info-text-bg">22,000</div>
                    </Col>
                    <Col span={6} className={styles.dashboardItem}>
                        <div className="sub-title-1"># Active Stakers</div>
                        <div className="info-text-bg">100,000</div>
                    </Col>
                    <Col span={6} className={styles.dashboardItem}>
                        <div className="sub-title-1">Annual Yield</div>
                        <div className="info-text-bg">8.3%</div>
                    </Col>
                    <Col span={6} className={styles.dashboardItem}>
                        <div className="sub-title-1">Participation Rate</div>
                        <div className="info-text-bg">23.2%</div>
                    </Col>
                </Row>
            </div>

            <div className={styles.lotterySection}>
                <h5>|&ensp;Lottery</h5>
            </div>

            <div className={styles.noetherSection}>
                <h5>|&ensp;Noether Node Runners</h5>
            </div>
        </Layout>
    );
};

export default Home;
