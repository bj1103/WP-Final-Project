import { gql } from '@apollo/client';

export const USER_SUBSCRIPTION = gql`
    subscription OnUser($token: String!) {
        subscribeToUser(token: $token) {
            pos {
                x,
                z
            },
            name,
            character,
            message
        }
    }
`;

export const OBJECT_SUBSCRIPTION = gql`
    subscription OnObject($token: String!) {
        subscribeToObject(token: $token) {
            pos {
                x,
                z
            },
            type,
            id,
        }
    }
`;
