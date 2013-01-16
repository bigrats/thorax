describe('button-link helpers', function() {
  it("option hash required arguments for button and link", function() {
    var link = $(Handlebars.helpers.link({hash: {href: 'a'}}).toString()),
        button = $(Handlebars.helpers.button({hash: {method: 'b'}}).toString());
    expect(link.attr('href')).to.equal('#a');
    expect(button.attr('data-call-method')).to.equal('b');
  });

  it("multiple arguments to link", function() {
    var html = Handlebars.helpers.link.call({}, 'a', 'b', 'c', {
      hash: {'class': 'test'},
      fn: function() { return 'link'; }
    });

    expect($(html.toString()).attr('href')).to.equal('#a/b/c');
  });

  it("expand-tokens in link", function() {
    var html = Handlebars.helpers.link.call({key: 'b'}, 'a/{{key}}', {
      hash: {'expand-tokens': false},
      fn: function() { return 'link'; }
    });

    expect($(html.toString()).attr('href')).to.equal('#a/{{key}}');

    html = Handlebars.helpers.link.call({key: 'b'}, 'a/{{key}}', {
      hash: {'expand-tokens': true},
      fn: function() { return 'link'; }
    });

    var el = $(html.toString());
    expect(el.attr('href')).to.equal('#a/b');
    expect(el.attr('expand-tokens')).to.not.exist;
  });

  it("button and link helpers", function() {
    var html, el;

    html = Handlebars.helpers.button.call({}, 'someMethod', {hash: {}, fn: function() { return 'Button'; }});
    el = $(html.toString());
    expect(el.html()).to.equal('Button');
    expect(el.attr('data-call-method')).to.equal('someMethod');

    html = Handlebars.helpers.button.call({}, {hash: {trigger: 'testEvent'}, fn: function() { return 'Button 2'; }});
    el = $(html.toString());
    expect(el.attr('data-trigger-event')).to.equal('testEvent');

    html = Handlebars.helpers.link.call({}, 'href', {hash: {}, fn: function() { return 'content'; }});
    el = $(html.toString());
    expect(el.html()).to.equal('content');
    expect(el.attr('href')).to.equal('#href');
  });
});
