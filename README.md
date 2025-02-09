## BackHack.dev

**BackHack.dev** makes any hackathon experience more engaging and fun by allowing you and your supporters to bet on results and earn when successful. It leverages **Atoma Network**'s decentralized AI and the **DeepSeek R1** model to quickly sync teams, automate result resolution from official hackathon websites.

The system is live on the Sui Testnet. With **zkLogin** enabling seamless Google sign-in, there's no need for a sophisticated Web3 wallet.

- https://backhack.dev

## Background

At some point, most Web3 builders participate in hackathons—whether to learn new things or compete for prizes. What if they could also bet on the results, allowing both participants and supporters to place bets on promising teams? With AI handling tasks like scoring teams, providing feedback, and ensuring fair odds. 

This opens the door for greater team interaction, where teams can review one another and potentially collaborate in the future. Making the hackathon not the end, but the beginning of something great.

## Overview

The system uses AWS Amplify Stack for fast development during the Sui AI-Agent Typhoon Hackathon and is deployed on AWS Cloud. It stores hackathon-related data in a database, while bets are processed on-chain via smart contracts. This helps us easily clean up duplicated or unrelated entries that may have been mistakenly input by users.

![backhack-dev drawio (2)](https://github.com/user-attachments/assets/1610d181-8692-4139-9790-96c0a31f3102)

Prizes are re-categorized or grouped for easier betting, ideally into 4-5 tiers, as shown in the table below:

![Screenshot from 2025-02-09 20-32-45](https://github.com/user-attachments/assets/dc128cd5-7933-4c9a-adc5-2893c2ce5e8c)

Bettors select a team to place their bet on, with all bets pooled together for each hackathon. If the selected team finishes in the Top 10 Finalists, 0.28 SUI will be distributed among all bettors who chose teams within the tier. Sometime the team can be classified in multiple tiers, so bettors who choose that team will receive payouts from each applicable tier.

## AI-Agent

The AI-agent plays a major role in the system, leveraging Atoma Network's decentralized AI to ensure the privacy of each team's information. While this information is currently public, in the future, teams may interact with the AI privately and receive feedback. DeepSeek R1 serves as the primary LLM for handling the following actions:

### Fetch Teams from Official Listings

Most hackathons display all the teams participating during the judging period, usually lasting 1-2 weeks. This allows judges to review and others to vote or check out what other projects are doing. 

Each hackathon may collaborate with different organizers and have various website layouts and styles. This creates difficulty in importing the data to other platforms, and having an API to provide this information is unlikely in this industry.

![Untitled design](https://github.com/user-attachments/assets/c04b4488-6af3-472e-a24a-55c01e9f1789)

Above shows how it looks. The AI-agent will start analyzing the URLs and extract team information regardless of the layout or style. 

As an AI-based application that works with prompts, we need to provide specific prompts to guide the system, one to list all teams and another to extract team information based on the given team name.

```
(1) Guide the system
You are an AI assistant that reads official website content to fetch teams.

(2) List all teams
List all teams from the provided markdown content.
Provided content:
${content} (website data in markdown)

(3) Extract team info
Fetching description from Team: ${team}
```

This is also done by calling the Atoma completion chat API: https://api.atoma.network/v1/chat/completions

## Review Team

Another action we use is to review teams based on the provided description. This allows the agent to analyze each project, ensuring alignment with the hackathon theme and rules. If the deadline hasn’t passed, early feedback can help teams improve their submissions. 

And for bettors, this allows them to make more informed decisions by understanding each team's details before placing their bets.

![Screenshot from 2025-02-09 21-24-53](https://github.com/user-attachments/assets/c5f48bdc-293d-43db-93f8-3ecca4bcc6c3)

Due to the limited time of the hackathon, we can analyze only the description. However, in the future, imagine AI reviewing codebases, social activity and providing insights to help projects go beyond the hackathon.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
