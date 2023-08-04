import TokenGenerator from "../../../api/lib/token_generator";

describe("Displaying users account info", () => {
    const testEmail = "user1@email.com"
    const testPassword = "12345678"
    const testUsername= "username1"
    let user_id;
    let token;

    before(() => {
        cy.signup(testEmail, testPassword, testUsername)
        .then((response) => {
            user_id = response.user_id;
            token = TokenGenerator.jsonwebtoken(user_id)
        })
    })

    it("shows username and email if user authorised", () => {
        cy.visit(`/users/${user_id}`)
        cy.get("#username").type(testEmail);
        cy.get("#email").type(testUsername)
        // can add a cy.get("").click() to redirect to feed page
        // and expect the url to be that of feed page
        // cy.get("#link").click()
        // cy.url().should("include", "/posts")
    })



})