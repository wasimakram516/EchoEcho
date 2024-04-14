# EchoEcho Social Media Platform

Welcome to the EchoEcho Social Media Platform repository. EchoEcho is a platform designed to foster community and connectivity through real-time communication and robust user interactions. This monorepo contains both the client and server code necessary to run the EchoEcho application.

## Structure

The repository is structured as follows:

- `client`: The React frontend of the platform.
- `server`: The Node.js/Express.js backend which includes the API and server logic.

## Getting Started

To get started with EchoEcho, you need to set up both the frontend and backend. Here's how you can do that:

### Prerequisites

- Node.js (LTS version)
- npm or Yarn
- MongoDB (local or remote instance)

### Setting Up the Server

# 1. Navigate to the `server` directory:

   cd server

### Install dependencies:

npm install

### Start the server:

npm start

### Setting Up the Client

# 2. Navigate to the `client` directory:

cd client

### Install dependencies:

npm install

### Start the React development server:

npm start

The client will now be running on http://localhost:3000 and the server on http://localhost:5000 by default.

### Environment Variables

Make sure to create a .env file in the server directory with the following variables:

DB_URI=mongodb://localhost/echoecho
JWT_SECRET=your_jwt_secret
PORT=5000
Replace your_jwt_secret with a secure, random string.

## Features

User Authentication
Real-time Chat
Posts Creation and Interaction
Media Sharing
Friend Requests and Community Building


If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

