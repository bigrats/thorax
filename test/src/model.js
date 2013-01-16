describe('model', function() {
  it("shouldFetch", function() {
    var options = {fetch: true};
    var a = new (Thorax.Model.extend())();
    expect(a.shouldFetch(options)).to.not.be.ok;

    var b = new (Thorax.Model.extend({urlRoot: '/'}))();
    expect(b.shouldFetch(options)).to.be['true'];

    var c = new (Thorax.Model.extend({urlRoot: '/'}))();
    c.set({key: 'value'});
    expect(c.shouldFetch(options)).to.not.be.ok;

    var d = new (Thorax.Collection.extend())();
    expect(d.shouldFetch(options)).to.not.be.ok;

    var e = new (Thorax.Collection.extend({url: '/'}))();
    expect(e.shouldFetch(options)).to.be['true'];

    var f = new (Thorax.Collection.extend({url: '/'}))();
    expect(f.shouldFetch({fetch: false})).to.be['false'];
  });

  it("model view binding", function() {
    var modelA = new Thorax.Model({a: 'a'}),
        modelB = new Thorax.Model({a: 'b'}),
        modelC = new Thorax.Model({a: 'c'});

    var a = new Thorax.View({
      name: 'test/properties',
      model: modelA
    });
    expect(a.el.innerHTML).to.equal('a\n', 'set via constructor');

    var b = new Thorax.View({
      name: 'test/properties'
    });
    b.setModel(modelB);
    expect(b.el.innerHTML).to.equal('b\n', 'set via setModel');

    modelB.set({a: 'B'});
    expect(b.el.innerHTML).to.equal('B\n', 'update attribute triggers render');
    modelB.set({a: 'b'});

    var c = new Thorax.View({
      name: 'test/properties'
    });
    c.setModel(modelC, {
      render: false
    });
    expect(c.el.firstChild).to.not.exist;
    c.render();
    expect(c.el.innerHTML).to.equal('c\n', 'manual render');
  });

  it("isPopulated", function() {
    expect((new Thorax.Model()).isPopulated()).to.be['false'];
    expect((new Thorax.Model({key: 'value'})).isPopulated()).to.be['true'];
  });

  it("$.fn.model", function() {
    var model = new Thorax.Model({
      a: 'value'
    });
    var view = new Thorax.View({
      model: model,
      name: 'test/properties'
    });
    view.render();
    expect(view.html()).to.equal('value\n');
    expect(view.$el.model()).to.equal(model);
  });

  it("model events", function() {
    var callCounter = {
      all: 0,
      test1: 0,
      test2: 0
    };
    var view = new Thorax.View({
      template: function() { return ''; },
      events: {
        model: {
          all: function() {
            ++callCounter.all;
          },
          test1: 'test1',
          test2: function() {
            ++callCounter.test2;
          }
        }
      },
      test1: function() {
        ++callCounter.test1;
      }
    });
    var model = new Thorax.Model();
    view.setModel(model, {fetch: false});
    var oldAllCount = Number(callCounter.all);
    model.trigger('test1');
    model.trigger('test2');
    expect(callCounter.all - oldAllCount).to.equal(2);
    expect(callCounter.test1).to.equal(1);
    expect(callCounter.test2).to.equal(1);
  });
});
