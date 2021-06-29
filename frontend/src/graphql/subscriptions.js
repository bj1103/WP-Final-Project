import { gql } from '@apollo/client';

export const USER_SUBSCRIPTION = gql`
    subscription OnUser($token: String!) {
        subscribeToUser(token: $token) {
            pos {
                x,
                z
            },
            name,
        }
    }
`;