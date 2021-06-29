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
            },
        }
    }
`;