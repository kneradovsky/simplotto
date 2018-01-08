module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "dev" // Match any network id
    },
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
