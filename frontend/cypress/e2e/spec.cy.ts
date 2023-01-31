describe("My First Test", () => {
  it("finds the content type", () => {
    cy.visit("https://example.cypress.io");

    cy.contains("type").click();

    cy.url().should("include", "/commands/actions");

    cy.get(".action-email").type("carl@lindman.dev");

    cy.get(".action-email").should("have.value", "carl@lindman.dev");
  });
});
