import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Monster {
    name: String
    srd20href: String
    sizetype: String
    hitdice: String
    initiative: String
    speed: String
    armorclass: String
    baseattackgrapple: String
    attack: String
    fullattack: String
    spacereach: String
    specialattacks: String
    specialqualities: String
    saves: String
    abilities: String
    skills: String
    feats: String
    environment: String
    organization: String
    challengerating: String
    treasure: String
    alignment: String
    advancement: String
    leveladjustment: String
  }

  type Query {
    getMonsters: [Monster]
    getMonster(name: String!): Monster!
  }
`;
