import { gql } from '@apollo/client';

export const ROOM_QUERY = gql`
    query getRoom($token: String!) {
        room(token: $token) {
            objects {
                    type,
                    pos {
                        x,
                        z
                    }
                },
            users {
                name,
                pos {
                    x,
                    z
                }
                character,
                message,
            },
        }
    }
`;

export const CHARACTER_QUERY = gql`
    query getCharacter($token: String!, $characters: [String!]) {
        getCharacter(token: $token, characters: $characters)
    }
`;
