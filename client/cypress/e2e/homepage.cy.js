describe("Homepage Loads", () => {
    it("should load the homepage", () => {
      cy.visit("/");
  
      // Check that the NavBar is present
      cy.get("nav").should("exist");
    });
  });
  