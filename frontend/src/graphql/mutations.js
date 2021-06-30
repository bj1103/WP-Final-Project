import { gql } from '@apollo/client';
// import DirectionType from './types.gql';

const USER_LOGIN_MUTATION = gql`
    mutation userLogin(
        $token: String!, 
        $name: String!,
        $character: String!,
    ) {
        login(
            token: $token,
            name: $name,
            character: $character
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
const OBJECT_CREATE_MUTATION = gql`
    mutation createObject(
        $token: String!, 
        $type: String!,
        $posX: Int!,
        $posZ: Int!,
    ) {
        createObject(
            token: $token,
            type: $type,
            posX: $posX,
            posZ: $posZ,
        ) {
            type,
            pos {
                x,
                z,
            }
        }
    }
`;

const OBJECT_DELETE_MUTATION = gql`
    mutation deleteObject(
        $token: String!, 
        $posX: Int!,
        $posZ: Int!,
    ) {
        deleteObject(
            token: $token,
            posX: $posX,
            posZ: $posZ,
        )
    }
`;
export { USER_LOGIN_MUTATION, USER_MOVE_MUTATION, OBJECT_CREATE_MUTATION, OBJECT_DELETE_MUTATION };
