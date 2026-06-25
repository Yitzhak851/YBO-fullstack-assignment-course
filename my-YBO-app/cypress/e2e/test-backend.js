// Test file that use cypress [e2e-test-backend]

// This file contains integration tests that check the communication between the Frontend and the Backend.
describe("Backend Integration Tests", () => {

    // this checks that the backend server is running and responding to a health check endpoint
    it("checks that backend server is running", () => {
        cy.request("http://localhost:5000/api/health")
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq("OK");
            });
    });

    // this checks that users can be fetched from the backend
    // by sending a GET request to the /api/users endpoint 
    // and verifying the response
    it("checks that users are fetched from backend", () => {
        cy.request("http://localhost:5000/api/users")
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an("array");
            });
    });

    // this checks that posts can be fetched from the backend
    // by sending a GET request to the /api/posts endpoint 
    // and verifying the response
    it("checks that posts are fetched from backend", () => {
        cy.request("http://localhost:5000/api/posts")
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an("array");
            });
    });

    // this checks that a login request is sent to the backend
    // when a user tries to log in
    it("checks that login request is sent to backend", () => {
        cy.visit("http://localhost:5173/login");
        cy.intercept("POST", "http://localhost:5000/api/auth/login").as("loginRequest");
        cy.get("[data-cy=email]").type("test@test.com");
        cy.get("[data-cy=password]").type("123456");
        cy.get("[data-cy=login-btn]").click();
        cy.wait("@loginRequest")
            .its("response.statusCode")
            .should("be.oneOf", [200, 201, 400, 401]);
    });

    // this checks that the feed page loads posts from the backend
    it("checks that feed loads posts from backend", () => {
        cy.visit("http://localhost:5173/feed");
        cy.intercept("GET", "http://localhost:5000/api/posts").as("getPosts");
        cy.wait("@getPosts")
            .its("response.statusCode")
            .should("eq", 200);
    });

});