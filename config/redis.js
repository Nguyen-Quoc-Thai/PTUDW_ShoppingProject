const redis = require('redis');

const redis_port_ssl = process.env.REDIS_PORT_SSL;
const redis_hostname = process.env.REDIS_HOSTNAME;
const redis_access_key = process.env.REDIS_ACCESS_KEY;

const RedisClient = redis.createClient(redis_port_ssl, redis_hostname, {
	auth_pass: redis_access_key,
	tls: {
		servername: redis_hostname,
	},
});

RedisClient.on('ready', () => {
	console.log('Redis already!');
});
RedisClient.on('error', (error) => {
	throw error;
});

module.exports = RedisClient;
