const redis = require("redis");

const redis_port = process.env.REDIS_PORT;
const redis_password = process.env.REDIS_PASSWORD;
const RedisClient = redis.createClient(redis_port);

RedisClient.auth(redis_password);
RedisClient.on("ready", () => {
  console.log("Redis already!");
});
RedisClient.on("error", (error) => {
  throw error;
});

module.exports = RedisClient;
