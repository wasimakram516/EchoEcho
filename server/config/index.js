require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const development = {
    app: {
        port: parseInt(process.env.DEV_PORT) || 3000
    },
    db: {
        uri: process.env.DEV_MONGO_URI
    }
};

const test = {
    app: {
        port: parseInt(process.env.TEST_PORT) || 3001
    },
    db: {
        uri: process.env.TEST_MONGO_URI
    }
};

const production = {
    app: {
        port: parseInt(process.env.PORT) || 3002
    },
    db: {
        uri: process.env.MONGO_URI
    }
};

const config = {
    development,
    test,
    production
};

module.exports = config[env];
