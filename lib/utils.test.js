const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);

const expect = chai.expect;
const rewire = require("rewire");
let mailer = rewire("./mailer");

var crypto = require("crypto");
var utils = require("./utils");
var config = require("./config");
const sandbox = sinon.createSandbox();

describe("utils", () => {
  let secretStub, digestStub, updateStub, createHashStub, hash;

  beforeEach(() => {
    secretStub = sandbox.stub(config, "secret").returns("fake_secret");
    digestStub = sandbox.stub().returns("ABC123");
    updateStub = sandbox.stub().returns({
      digest: digestStub
    });
    createHashStub = sandbox.stub(crypto, "createHash").returns({
      update: updateStub
    });

    hash = utils.getHash("foo");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return null if invalid string is passed", () => {
    sandbox.reset();

    [null, 123, { name: "bart" }].forEach(
      arg => expect(utils.getHash(arg)).to.be.null
    );

    expect(createHashStub).to.not.have.been.called;
  });

  it("should set secrets from config", () => {
    expect(secretStub).to.have.been.called;
  });

  it("should call crypto with right settings and return a hash", () => {
    expect(createHashStub).to.have.been.calledWith("md5");
    expect(updateStub).to.have.been.calledWith("foo_fake_secret");
    expect(digestStub).to.have.been.calledWith("hex");
    expect(hash).to.equal("ABC123");
  });
});
