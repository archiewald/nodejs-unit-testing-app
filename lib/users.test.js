const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);

const expect = chai.expect;
const rewire = require("rewire");

const mongoose = require("mongoose");

const users = require("./users");
const Users = require("./models/user");

const sandbox = sinon.createSandbox();

describe("users", () => {
  let findStub;
  let sampleArgs;
  let sampleUser;

  beforeEach(() => {
    sampleUser = {
      id: 123,
      name: "foo",
      email: "foo@bar.com"
    };

    findStub = sandbox.stub(mongoose.Model, "findById").resolves(sampleUser);
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("get", () => {
    it("should check for an id", done => {
      users.get(null, (err, result) => {
        expect(err).to.exist;
        expect(err.message).to.equal("Invalid user id");
        done();
      });
    });

    it("should call findUserById with id and return result", done => {
      sandbox.restore();
      findStub = sandbox
        .stub(mongoose.Model, "findById")
        .yields(null, { name: "foo" }); // stub callback

      users.get(123, (err, result) => {
        expect(err).to.not.exist;
        expect(findStub).to.be.calledOnce;
        expect(findStub).to.be.calledWith(123);
        expect(result).to.be.a("object");
        expect(result)
          .to.have.property("name")
          .to.equal("foo");

        done();
      });
    });
  });
});
