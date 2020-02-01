const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);
const request = require("supertest");
const users = require("./users");

const expect = chai.expect;
const sandbox = sinon.createSandbox();
const rewire = require("rewire");

let app = rewire("./app");

describe("app", () => {
  afterEach(() => {
    app = rewire("./app");
    sandbox.restore();
  });

  context("GET /", () => {
    it("should get /", done => {
      request(app)
        .get("/")
        .expect(200)
        .end((err, response) => {
          expect(response.body)
            .to.have.property("name")
            .to.equal("Foo Fooing Bar");

          done();
        });
    });
  });

  context("POST /user", () => {
    let createStub, errorStub;

    it("should call user.create", done => {
      createStub = sandbox.stub(users, "create").resolves({ name: "foo" });

      request(app)
        .post("/user")
        .send({ name: "fake" })
        .expect(200)
        .end((err, response) => {
          expect(createStub).to.have.been.calledOnce;
          expect(response.body)
            .to.have.property("name")
            .to.equal("foo");
        });

      done();
    });

    it("should call handleError on error", done => {
      createStub = sandbox
        .stub(users, "create")
        .rejects(new Error("fake_error"));

      errorStub = sandbox.stub().callsFake((res, error) => {
        return res.status(400).json({ error: "fake" });
      });

      app.__set__("handleError", errorStub);

      request(app)
        .post("/user")
        .send({ name: "fake" })
        .expect(400)
        .end((err, response) => {
          expect(createStub).to.be.calledOnceWith({ name: "fake" });
          expect(errorStub).to.be.calledOnce;
          expect(response.body)
            .to.have.property("error")
            .to.equal("fake");

          done();
        });
    });
  });
});
