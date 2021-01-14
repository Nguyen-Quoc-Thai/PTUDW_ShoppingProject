const redis = require('redis');

const REDIS_PORT_SSL = process.env.REDIS_PORT_SSL;
const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME;
const REDIS_ACCESS_KEY = process.env.REDIS_ACCESS_KEY;

// Create client
const RedisClient = redis.createClient(REDIS_PORT_SSL, REDIS_HOSTNAME, {
	auth_pass: REDIS_ACCESS_KEY,
	tls: {
		servername: REDIS_HOSTNAME,
	},
});

// Ready action
RedisClient.on('ready', () => {
	console.log('Redis already!');
});

// Conect error action
RedisClient.on('error', (error) => {
	throw error;
});

module.exports = RedisClient;
