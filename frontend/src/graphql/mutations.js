import { gql } from '@apollo/client';
// import DirectionType from './types.gql';

const USER_LOGIN_MUTATION = gql`
    mutation userLogin(
        $token: String!, 
        $name: String!,
    ) {
        login(
            token: $token,
            name: $name,
        ) {
            x,
            z,
        }
    }
`;

const USER_MOVE_MUTATION = gql`
    mutation userMove(
        $token: String!, 
        $name: String!,
        $direction: DirectionType!,
    ) {
        move(
            token: $token,
            name: $name,
            direction: $direction,
        ) {
            x,
            z,
        }
    }
`;
export { USER_LOGIN_MUTATION, USER_MOVE_MUTATION };