const chai = require("chai");
const expect = chai.expect;

const User = require("./user");

describe("User model", () => {
  it("should validate user and return error for each missing field", done => {
    const user = new User();

    user.validate(error => {
      expect(error.errors.name).to.exist;
      expect(error.errors.email).to.exist;
      expect(error.errors.age).to.not.exist;

      done();
    });
  });

  it("should have optional age field", done => {
    const user = new User({
      name: "foo",
      email: "bar",
      age: 35
    });

    expect(user)
      .to.have.property("age")
      .to.equal(35);

    done();
  });
});
