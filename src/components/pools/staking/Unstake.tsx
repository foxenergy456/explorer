// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
    Fade,
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    Radio,
    RadioGroup,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { GrSubtract } from 'react-icons/gr';
import Title from './Title';

export interface UnstakeProps {
    shares: BigNumber;
    onCancel: () => void;
    onSubmit: (value: BigNumberish) => void;
}

interface FormData {
    type: 'full' | 'partial';
    amount: number;
}

const Unstake: FC<UnstakeProps> = ({ shares, onCancel, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            amount: parseFloat(formatUnits(shares, 18)),
        },
        mode: 'onChange',
    });

    const validate = (value: number) => {
        const bn = parseUnits(value.toString(), 18);
        if (bn.isZero()) {
            return 'Value must be greater than 0';
        } else if (bn.gt(shares)) {
            return 'Not enough balance';
        }
        return true;
    };

    const type = watch('type');

    return (
        <HStack justify="space-between">
            <Title
                title="Unstake"
                icon={<GrSubtract />}
                help="Amount of tokens to unstake from pool"
            />
            <HStack>
                <Fade in={type === 'partial'} unmountOnExit={true}>
                    <HStack align="baseline">
                        <FormControl isInvalid={!!errors.amount}>
                            <Input
                                maxW={200}
                                fontSize="xx-large"
                                textAlign="right"
                                type="number"
                                min={0}
                                autoFocus
                                {...register('amount', {
                                    required: true,
                                    valueAsNumber: true,
                                    validate,
                                })}
                            />
                            <FormErrorMessage>
                                {errors.amount?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Text fontSize="small">CTSI</Text>{' '}
                    </HStack>
                </Fade>
                <RadioGroup>
                    <HStack minW="280px">
                        <Radio value="partial" {...register('type')}>
                            Partial amount
                        </Radio>
                        <Radio value="full" {...register('type')}>
                            Full amount
                        </Radio>
                    </HStack>
                </RadioGroup>
                <HStack minW={100}>
                    <Tooltip label="Save" placement="top">
                        <IconButton
                            icon={<CheckIcon />}
                            aria-label="Save"
                            size="md"
                            onClick={handleSubmit((data) =>
                                onSubmit(parseUnits(data.amount.toString(), 18))
                            )}
                        />
                    </Tooltip>
                    <Tooltip label="Cancel" placement="top">
                        <IconButton
                            icon={<CloseIcon />}
                            aria-label="Cancel"
                            size="md"
                            onClick={onCancel}
                        />
                    </Tooltip>
                </HStack>
            </HStack>
        </HStack>
    );
};

export default Unstake;