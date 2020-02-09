const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const Order = require("./order");
const sandbox = sinon.sandbox.create();

describe("order", () => {
  let warnStub, dateSpy, user, items, order;

  beforeEach(() => {
    warnStub = sandbox.stub(console, "warn");
    dateSpy = sandbox.spy(Date, "now");

    user = { id: 1, name: "foo" };
    items = [
      { name: "Book", price: 10 },
      { name: "Dice set", price: 5 }
    ];

    order = new Order(123, user, items);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create instance or Order and calculate total + shipping", () => {
    expect(order).to.be.instanceOf(Order);
    expect(dateSpy).to.have.been.calledTwice;
    expect(order)
      .to.have.property("ref")
      .to.equal(123);
    expect(order)
      .to.have.property("user")
      .to.deep.equal(user);
    expect(order)
      .to.have.property("items")
      .to.deep.equal(items);
    expect(order)
      .to.have.property("status")
      .to.equal("Pending");
    expect(order)
      .to.have.property("createdAt")
      .to.be.a("Number");
    expect(order)
      .to.have.property("updatedAt")
      .to.be.a("Number");
    expect(order)
      .to.have.property("subtotal")
      .to.equal(15);
    expect(order)
      .to.have.property("shipping")
      .to.equal(5);
    expect(order)
      .to.have.property("total")
      .to.equal(20);

    expect(order.save).to.be.a("function");
    expect(order.cancel).to.be.a("function");
    expect(order.ship).to.be.a("function");
  });

  it("should update status to active and return order details", () => {
    const result = order.save();

    expect(dateSpy).to.have.been.calledThrice;
    expect(order.status).to.equal("Active");
    expect(result).to.be.a("Object");
    expect(result)
      .to.have.property("user")
      .to.equal("foo");
    expect(result)
      .to.have.property("updatedAt")
      .to.be.a("Number");
    //rest of props
  });

  it("should cancel an order, update status and set shipping and total to zero", () => {
    const result = order.cancel();

    expect(warnStub).to.have.been.calledWith("Order cancelled");
    expect(dateSpy).to.have.been.calledThrice;
    expect(order.status).to.equal("Cancelled");
    expect(result).to.be.true;
    expect(order.shipping).to.equal(0);
    expect(order.total).to.equal(0);
  });

  it("should update status to shipped", () => {
    order.ship();

    expect(order.status).to.equal("Shipped");
    expect(dateSpy).to.have.been.calledThrice;
  });
});
