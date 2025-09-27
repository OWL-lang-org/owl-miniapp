<!-- PROJECT INTRO -->

<!-- Notas:

No olvidar conectar los repos o folders
No olvidar subir el link de la mini app
No olvidar subir el link del demo 
 -->
 <a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

</div>


<br />
<div align="center">
  <a href="https://github.com/OWL-lang-org/owl-miniapp">
    <img src="https://i.ibb.co/PzvGT54S/Banner-para-Twitch-Gamer-Streaming-Atrevido-Lila-1.png">
  </a>

 <h3 align="center">🦉On-chain open world game to explore and learn through a creative storyline.🦉</h3>

  <p align="center">

  [World Build 2 Hackathon](https://fwbhq.notion.site/world-build-2)

   <br />
    <a href="https://github.com/OWLSuperhack/owl-backend"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://github.com/OWLSuperhack/owl-backend">View Demo</a>
    ·
    <!-- Agregar Demo Link Aquí -->
    <a href="https://github.com/OWLSuperhack/owl-backend">Report Bug</a>
    ·
    <a href="https://github.com/OWLSuperhack/owl-backend">Request Feature</a>
  </p>
</div>

<br />


<!-- TABLE OF CONTENTS -->

# Table of Contents 

1. [About de Project](#about-the-project)
2. [Demo](#demo)
3. [How it works](#how-it-works)
4. [Team](#team)
5. [Installation](#installation)

<br />


<!-- ABOUT THE PROJECT -->

# About The Project


<br />


![OWL](https://i.ibb.co/1y3NnHj/1.jpg)


OWL (Open World of Learning) is an on-chain open-world game inside a World Mini App where players can explore and learn almost any subject, starting with English classes for over [3 million World Mini Apps Spanish speakers across Latin America.](https://www.miniapps.world/country-ranks) 

It blends narrative and multimedia in an interactive journey that lets each player progress at their own pace, making intuitive connections that strengthen long-term memory.

Its flexible storyline adapts to any learning order, while seamless on-chain interactions add attestations along the way and include a user stake: players begin with an oath and a monetary commitment that is returned once their learning goals are achieved, reinforcing commitment to the game.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


# Demo

<!--[![Demo Video](Video) -->

<!-- Ready to explore? Chat with OWL Bot: https://t.me/OwlSuperHackBot -->

<p align="right">(<a href="#readme-top">back to top</a>)</p> 



# How it Works

Game’s architecture integrates several key components to create a seamless and engaging experience for players.

## Key Components


## User Journey

- **Initial Setup:** Players begin by watching a video that guides them to create an EOA wallet (e.g., Metamask or Zerion), which becomes their digital identity in the game.
- **First Command:** After setting up the wallet, players send their first command to begin their journey in the OWL universe.
- **Story Progression:** Players navigate through the storyline, making choices that affect their path. The game adapts to these choices, ensuring a personalized learning experience, while unlocking on-chain interactions.
- **Attestations and Rewards:** As players complete levels and milestones, they earn attestations and unlock dynamic NFTs or badges that reflect their progress and achievements.
- **Side Quests:** Players can engage in side quests, such as registering with World ID, to explore additional aspects of the game and gain access to unique rewards.

Overall, OWL delivers an educational experience that is both engaging and immersive, with a strong emphasis on intuitive learning and the seamless integration of blockchain technology.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->


# Team

Natalia Emma Carvajal ([@nataliaemmaC](https://twitter.com/nataliaemmaC)): OWL Founder
<br />

Sebastian Guaqueta ([@scguaquetam](https://twitter.com/scguaquetam)): Sr. Software Engineer at Rootstock , collaborator at [WTF Academy Contributor](https://twitter.com/WTFAcademy_).
<br />

Nicolas Vergara ([@champilas](https://x.com/champilas)): Backend Developer at [happ3n](https://x.com/happ3nxyz)
<br />

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INstallation -->

## Installation 

### Prerequisites

- Ensure Docker is installed and running on your machine.
- Node.js and npm should be installed.
- Ensure you have Nodemon installed globally.

### Steps to Set Up the Project

1. **Start Docker**

   Make sure Docker is running. Use the following command to start the Docker containers (use sudo if needed):
   ```sh
   docker compose -f ./docker-compose-dev.yml up -d

2. **Install Node Modules (Only first time)**

   Install the required Node modules by running:

   ```sh
   npm install

3. **Run Migrations (Only first time)**

   To set up the database schema, run the migrations:

   ```sh
   npm run migrations:run

4. **Install Nodemon (if not installed)**

   Nodemon is used for automatically restarting the server. Install it globally if you haven't already:

   ```sh
   npm install -g nodemon

5. **Run the Server**

   Start the development server with:

   ```sh
   npm run dev

### Environment Variables

Create a `.env` file in the root directory of the project. Use the `example.env` file as a guide to set up your environment variables.

### Database Backup

If you have a backup or a previous database to use, place it inside a folder named `postgres` at the root of the project directory. Ensure all the database files are directly inside this folder without any extra subfolders.

### Stack Specifications

- **Node.js**: The runtime environment for executing JavaScript on the server side.
- **Express**: A minimal and flexible Node.js web application framework.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **PostgreSQL**: The relational database management system used.
- **Sequelize**: A promise-based Node.js ORM for PostgreSQL.

### Additional Notes

- Make sure Docker is running before executing any Docker commands.
- The `.env` file is crucial for configuration. Double-check the variables set in this file.
- Follow the folder structure guidelines for database backups to ensure proper loading.

By following these steps, you should be able to set up and run the project in a development environment successfully.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS -->

[contributors-shield]: https://img.shields.io/github/contributors/OWL-lang-org/owl-miniapp.svg?style=for-the-badge&color=187f77

[contributors-url]: https://github.com/OWL-lang-org/owl-miniapp/graphs/contributors

[stars-shield]: https://img.shields.io/github/stars/OWL-lang-org/owl-miniapp.svg?style=for-the-badge&color=white

[stars-url]: https://github.com/OWL-lang-org/owl-miniapp/stargazers

[issues-shield]: https://img.shields.io/github/issues/OWL-lang-org/owl-miniapp.svg?style=for-the-badge&color=187f77

[issues-url]: https://github.com/OWL-lang-org/owl-miniapp/issues
