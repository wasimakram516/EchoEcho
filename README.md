# EchoEcho Social Media Platform

Welcome to the EchoEcho Social Media Platform repository. EchoEcho is designed to foster community and connectivity through real-time communication and robust user interactions. This repository contains both the client and server code necessary to run the EchoEcho application using the Next.js and Node.js frameworks.

## Structure

The repository is structured as follows:

- `client`: The Next.js frontend of the platform.
- `server`: The Node.js/Express.js backend including the API and server logic.

## Getting Started

To get started with EchoEcho, you need to set up both the frontend and backend. Here's how you can do that:

### Prerequisites

- Node.js (LTS version)
- npm or Yarn
- MongoDB (local or remote instance)

### Setting Up the Server

1. Navigate to the `server` directory:

```sh
cd server
```

2. Install dependencies:

```sh
npm install
```

3. Start the server:

```sh
npm run dev
```

The server will now be running on http://localhost:5000 by default.

### Setting Up the Client

1. Navigate to the `client` directory:

```sh
cd client
```

2. Install dependencies:

```sh
npm install
```

3. Start the Next.js development server:

```sh
npm run dev
```

The client will now be running on http://localhost:3000.

### Environment Variables

Make sure to create a `.env.local` file in the root of the `client` directory and a `.env` file in the `server` directory with the necessary environment variables.

For the server, you should have:

```plaintext
DB_URI=mongodb://localhost/echoecho
JWT_SECRET=your_jwt_secret
PORT=5000
```

Replace `your_jwt_secret` with a secure, random string.

For the client, if needed, add variables like:

```plaintext
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Features

- User Authentication
- Real-time Chat
- Posts Creation and Interaction
- Media Sharing
- Friend Requests and Community Building

## Contributions

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
