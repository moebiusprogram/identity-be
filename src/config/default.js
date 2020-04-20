const config = {
  port: 3010,

  db: 'mongodb://localhost:27017/kyc-db',

  email: {
    domain: 'localhost',
    mailgun: {
      public: 'insert you public key here',
      private: 'insert your private key here'
    },
    masterEmail: 'galen@norestlabs.com',
    from: {
      general: 'hello@norestlabs.com',
    },
    template: {
      folder: 'default',
    }
  },
  project: 'CurrencyUp',

  API_KEY: 'apikey-1234567890',
  frontendBaseUrl: 'http://identity.currencyup.com/verify', // kyc-frontend url
  baseUrl: 'https://identity.currencyup.com/api/v1', // kyc-backend url

  demoMode: false,
};

module.exports = config;
