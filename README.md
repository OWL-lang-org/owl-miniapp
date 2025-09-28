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

<!-- OWL CODEBASE -->

<div align="center">
  <h2>🛠️ OWL Codebase</h2>
  
  <a href="https://github.com/OWL-lang-org/owl-miniapp">
    <img src="https://img.shields.io/badge/Frontend-Mini%20App-187f77?style=for-the-badge&logo=github" alt="Frontend Repository">
  </a>
  <a href="https://github.com/OWL-lang-org/owl-world-backend">
    <img src="https://img.shields.io/badge/Backend-API%20Server-187f77?style=for-the-badge&logo=github" alt="Backend Repository">
  </a>
  
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

The game's design brings out the player's curiosity and then uses it to create a unique learning path/syllabus cronogram. It combines different learning methods like puzzles, repetition, in-context usage, integration of concepts from different CFR levels, explicit visual explanations, AI conversations and even note taking. 

World not only facilitates a seamless in-app staking option per challenge to increase commitment and motivation, but it also verifies that a human has begun, is in the process of, or has completed an English course satisfactorily thus combating the three biggest blockers of online language learning in LATAM.

Game’s architecture integrates several key components to create a seamless and engaging experience for players.

## Core Components:

* Gamification
* Learn to earn use-case
* Open World gaming flow
* Commitment staking in-app
* Integrated wallet
* PoH certifying completion of course
* Seamless attestations as checkpoints

## User Journey

* **Initial Setup** : Players are asked if they would like to stake individually or as a group towards the completion of the English course.
* **Inmersion video and learning interface** : Players are introduced to the story through inmersive story video that places them as the main character. They are then given two simple tasks to complete in order to learn how to navigate.
* **Puzzles and challenges** : As they navigate the world, players are given the choice to go through challenges and puzzles specifically desgined to teach them English by forcing them to make their own conclusions based on what works and what doesn't. They learn at their own time and order, with their own connections and thus lock them into their long term memory. 
* **Additional material** : Players will unlock explanational videos and they may choose to take notes of what they've learned as well as revisit practice mini-games, which, with AI, they can expect a virtually endless variety of materials.
* **Story progression** : While the story progresses, the checkpoints manifest as attestations and players collect pieces of an NFT (which acts as their progress bar) to be minted at the end of the course.

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
