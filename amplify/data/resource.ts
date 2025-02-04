import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      hackathons: a.hasMany('Hackathon', "managerId"),
      reviews: a.hasMany('Review', "userId"),
      positions: a.hasMany('Position', "userId"),
      role: a.enum(["USER", "MANAGER", "ADMIN"])
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Hackathon: a
    .model({
      managerId: a.id().required(),
      manager: a.belongsTo('User', "managerId"),
      onchainId: a.integer(),
      title: a.string().required(),
      description: a.string(),
      image: a.url(),
      urls: a.string().array(),
      status: a.enum(["UPCOMING", "ONGOING", "COMPLETED"]),
      startDate: a.datetime(),
      endDate: a.datetime(),
      category: a.string(),
      tags: a.string().array(),
      reviews: a.hasMany('Review', "hackathonId"),
      prizes: a.hasMany('Prize', "hackathonId"),
      teams: a.hasMany('Team', "hackathonId"),
      positions: a.hasMany('Position', "hackathonId")
    })
    .authorization((allow) => [allow.publicApiKey()]),
    Review: a.model({
      hackathonId: a.id().required(),
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      hackathon: a.belongsTo('Hackathon', "hackathonId"),
      rating: a.integer(),
      content: a.string(),
      createdDate: a.datetime()
    }).authorization((allow) => [allow.publicApiKey()]),
    Position: a.model({
      hackathonId: a.id().required(),
      hackathon: a.belongsTo('Hackathon', "hackathonId"),
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      predictedTeam: a.integer(),
      betAmount: a.string(),
      hidden: a.boolean(),
      status: a.enum(["PENDING", "WIN", "LOSE", "CANCELLED"]),
      walletAddress: a.string(),
      epoch: a.integer(),
      createdDate: a.datetime()
    }).authorization((allow) => [allow.publicApiKey()]),
    Team: a.model({
      hackathonId: a.id().required(),
      hackathon: a.belongsTo('Hackathon', "hackathonId"),
      onchainId: a.integer(),
      name: a.string().required(),
      description: a.string(),
      image: a.url(),
      github: a.url(),
      socials: a.url().array(),
      createdDate: a.datetime()
    }).authorization((allow) => [allow.publicApiKey()]),
    Prize: a.model({
      hackathonId: a.id().required(),
      hackathon: a.belongsTo('Hackathon', "hackathonId"),
      onchainId: a.integer(),
      title: a.string().required(),
      description: a.string(),
      image: a.url(),
      odds: a.integer(),
      createdDate: a.datetime()
    }).authorization((allow) => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
