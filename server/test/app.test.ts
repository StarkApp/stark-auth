import * as supertest from "supertest";
const request = supertest("http://localhost:8081");

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request.get("/reset")
            .expect(404, done);
    });
});
