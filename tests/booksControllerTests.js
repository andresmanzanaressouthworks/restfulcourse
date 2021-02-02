const should = require("should");
const sinon = require("sinon");
const bookControler = require("../controllers/bookController");

describe("Book controller test", () => {
  describe("post test", () => {
    it("should not allow an empty title on psot", () => {
      const Book = function (book) {
        this.save = () => {};
      };
      const req = {
        body: {
          author: "Jon",
        },
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
      };

      const controller = bookControler(Book);
      controller.post(req, res);

      res.status
        .calledWith(400)
        .should.equal(true, `Bas status ${res.status.args[0][0]}`);
      res.send.calledWith("Title is required").should.equal(true);
    });
  });
});
