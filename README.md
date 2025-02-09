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

Bettors select a team to place their bet on, with all bets pooled together for each hackathon. If the selected team finishes in the Top 10 Finalists, 0.28 SUI will be distributed among all bettors who chose teams within this tier.


## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
