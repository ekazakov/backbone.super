define(function(require) {
    require("backbone.super");

    var Backbone = require("backbone");

    describe("Backbone.Super", function () {
        describe("Super constructor", function () {
            it("Should call parent constructor", function () {
                var spy = sinon.spy(Backbone.Model.prototype, "constructor");

                var Model = createSubclass(Backbone.Model);

                var m = new Model({x: 1, y: 2});
                expect(m.get("x")).to.be.equal(1);

                spy.should.have.been.calledOnce;
                Backbone.Model.prototype.constructor.restore();
            });

            it("Should call parent constructor in long hierarchy", function () {
                var spy   = sinon.spy(Backbone.Model.prototype, "constructor");
                var Model = createSubclass(Backbone.Model);

                var spy2     = sinon.spy(Model.prototype, "constructor");
                var SubModel = createSubclass(Model);

                var spy3     = sinon.spy(SubModel.prototype, "constructor");
                var SubSubModel = createSubclass(SubModel);

                var m = new SubSubModel({ x: 1, y: 2, z: 3 });

                expect(m.get("x")).to.be.equal(1);
                expect(m.get("y")).to.be.equal(2);
                expect(m.get("z")).to.be.equal(3);

                spy.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;
                spy3.should.have.been.calledOnce;
            });
        });
    });

    function createSubclass (type) {
        return type.extend({
            constructor: function (attrs, options) {
                this._super(attrs, options);
            }
        });
    }
});
