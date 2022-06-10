// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    cleanup,
    fireEvent,
    prettyDOM,
    render,
    screen,
} from '@testing-library/react';
import CommissionModel from '../../../../src/components/pools/steps/CommissionModel';

describe('CommissionModel step component', () => {
    describe('when not on focus', () => {
        it('Should only display the number, the title and the subtitle.', () => {
            render(<CommissionModel stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Commission Model')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Choose the commission model and fee for your pool'
                )
            ).toBeInTheDocument();
            expect(
                screen.queryByLabelText('Flat-rate commission (%)')
            ).not.toBeInTheDocument();
            expect(
                screen.queryByLabelText('Gas-based commission (Gas)')
            ).not.toBeInTheDocument();
            expect(screen.queryByText('PREVIOUS')).not.toBeInTheDocument();
            expect(screen.queryByText('CREATE POOL')).not.toBeInTheDocument();
        });
    });

    describe('When in focus', () => {
        it('should display the headers, body and action buttons', () => {
            render(<CommissionModel stepNumber={1} inFocus />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('Commission Model')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Choose the commission model and fee for your pool'
                )
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText('Flat-rate commission (%)')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'This model calculates the commission as a fixed percentage of the block CTSI reward before distributing the remaining amount to the pool users.'
                )
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText('Gas-based commission (Gas)')
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    'This model calculates the commission considering the current network gas price, Ethereum price and CTSI price. The configured amount of gas above is multiplied by the gas price provided by a ChainLink oracle, then converted from ETH to CTSI using an Uniswap V2 price oracle.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('PREVIOUS')).toBeInTheDocument();
            expect(screen.getByText('CREATE POOL')).toBeInTheDocument();
        });
    });
});