import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: ["cypress/integration/**/*.cy.{js,ts}", "cypress/e2e/**/*.cy.{js,ts}"],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    env: {
      API_URL: 'http://localhost:3000'
    }
  },
});
