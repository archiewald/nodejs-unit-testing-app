const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);
const sandbox = sinon.createSandbox();

const expect = chai.expect;
const rewire = require("rewire");
let mailer = rewire("./mailer");

describe("mailer", () => {
  let emailStub;

  beforeEach(() => {
    emailStub = sandbox.stub().resolves("done");
    mailer.__set__("sendEmail", emailStub);
  });

  afterEach(() => {
    sandbox.restore();
    mailer = rewire("./mailer");
  });

  context("sendWelcomeEmail", () => {
    it("should check for email and name", async () => {
      await expect(mailer.sendWelcomeEmail()).to.eventually.be.rejectedWith(
        "Invalid input"
      );
      await expect(
        mailer.sendWelcomeEmail("foo@bar.com")
      ).to.eventually.be.rejectedWith("Invalid input");
    });

    it("should call sendEmail with email and message", async () => {
      await mailer.sendWelcomeEmail("test@example.com", "test");

      expect(emailStub).to.have.been.calledWith(
        "test@example.com",
        "Dear test, welcome to our family!"
      );
    });
  });

  context("sendPasswordResetEmail", () => {
    it("should check for email", async () => {
      await expect(
        mailer.sendPasswordResetEmail()
      ).to.eventually.be.rejectedWith("Invalid input");
    });

    it("should call sendEmail with email and message", async () => {
      await mailer.sendPasswordResetEmail("test@example.com");

      expect(emailStub).to.have.been.calledWith(
        "test@example.com",
        "Please click http://some_link to reset your password."
      );
    });
  });

  context("sendEmail", () => {
    let sendEmail;

    beforeEach(() => {
      mailer = rewire("./mailer");
      sendEmail = mailer.__get__("sendEmail");
    });

    it("should check for email and body", async () => {
      await expect(sendEmail()).to.eventually.be.rejectedWith("Invalid input");
      await expect(sendEmail("test@email.com")).to.eventually.be.rejectedWith(
        "Invalid input"
      );
    });

    it("should call sendEmail with email and message", async () => {
      // stub actual mailer

      const result = await sendEmail("test@email.com", "welcome");

      expect(result).to.equal("Email sent");
    });
  });
});
