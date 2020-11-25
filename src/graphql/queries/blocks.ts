import gql from 'graphql-tag';

export const BLOCKS = gql`
    query blocks(
        $first: Int
        $where: Block_filter
        $orderBy: Block_orderBy
        $orderDirection: OrderDirection
    ) {
        blocks(
            first: $first
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id

            number
            timestamp
            reward
            difficulty

            chain {
                id
            }

            producer {
                id
            }

            node {
                id
            }
        }
    }
`;

export const blocksQueryVars = {
    first: 10,
    where: {},
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
