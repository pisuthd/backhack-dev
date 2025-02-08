import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      hackathons: a.hasMany('Hackathon', "managerId"),
      comments: a.hasMany('Comment', "userId"),
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
      prizePool: a.string(),
      period: a.string(),
      image: a.url(),
      urls: a.string().array(),
      status: a.enum(["UPCOMING", "ONGOING", "COMPLETED"]),
      startDate: a.datetime(),
      endDate: a.datetime(),
      category: a.string(),
      tags: a.string().array(),
      comments: a.hasMany('Comment', "hackathonId"),
      prizes: a.hasMany('Prize', "hackathonId"),
      teams: a.hasMany('Team', "hackathonId"),
      positions: a.hasMany('Position', "hackathonId")
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Comment: a.model({
    hackathonId: a.id().required(),
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    hackathon: a.belongsTo('Hackathon', "hackathonId"),
    rating: a.integer(),
    content: a.string()
  }).authorization((allow) => [allow.publicApiKey()]),
  Position: a.model({
    hackathonId: a.id().required(),
    hackathon: a.belongsTo('Hackathon', "hackathonId"),
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    onchainId: a.integer(),
    predictedTeam: a.integer(),
    betAmount: a.string(),
    hidden: a.boolean(),
    status: a.enum(["PENDING", "WIN", "LOSE", "CANCELLED"]),
    walletAddress: a.string(),
    epoch: a.integer()
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
    comments: a.hasMany('Review', "teamId"),
  }).authorization((allow) => [allow.publicApiKey()]),
  Review: a.model({
    teamId: a.id().required(),
    user: a.belongsTo('Team', "teamId"),
    reviewer: a.string(),
    overallScore: a.integer(),
    feedback: a.string(),
    improvementSuggestions: a.string().array()
  }).authorization((allow) => [allow.publicApiKey()]),
  Prize: a.model({
    hackathonId: a.id().required(),
    hackathon: a.belongsTo('Hackathon', "hackathonId"),
    onchainId: a.integer(),
    title: a.string().required(),
    description: a.string(),
    image: a.url(),
    odds: a.integer()
  }).authorization((allow) => [allow.publicApiKey()]),
  FetchTeamAI: a.generation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: 'You are an AI assistant that reads official website content to fetch teams. Display the team name as the header, followed by its description.',
    inferenceConfiguration: {
      temperature: 1,
      topP: 0.999,
      maxTokens: 4096
    }
  })
    .arguments({
      description: a.string()
    })
    .returns(
      a.customType({
        team: a.string().array()
      })
    )
    .authorization((allow) => allow.publicApiKey()),
  ReviewTeamAI: a.generation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: 'You are an AI assistant that reviews teams by analyzing their details, scoring their performance, and providing insights based on predefined criteria.',
    inferenceConfiguration: {
      temperature: 1,
      topP: 0.999,
      maxTokens: 4096
    }
  })
    .arguments({
      description: a.string()
    })
    .returns(
      a.customType({
        overallScore: a.integer(),
        feedback: a.string(),
        improvementSuggestions: a.string().array()
      })
    )
    .authorization((allow) => allow.publicApiKey()),
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
