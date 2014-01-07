Boundless = Ember.Namespace.create({
  VERSION: '0.1.0'
});

Boundless.MapLayer = Ember.Object.extend({
    title: null,
    visible: null,
    group: null,
    init: function(layer) {
        this.title = layer.get('title');
        this.visible = layer.get('visible');
        this.group = layer.get('group');
        this.addObserver('visible', layer, function(evt) {
            this.set('visible', evt.get('visible'));
        });
        layer.on('change:title', function(evt) {
            this.set('title', evt.target.get('title'));
        }, this);
        layer.on('change:visible', function(evt) {
            this.set('visible', evt.target.get('visible'));
        }, this);
        delete this.layer;
    }
});

Boundless.LayerSwitcherComponent = Ember.Component.extend({
  init: function() {
      this._super();
      var lc = map.getLayers();
      // if an item is removed from the layers collection, update our view
      lc.on('remove', function(evt) {
          var el = evt.getElement();
          this.model.removeObject(this.model.findBy('title', el.get('title')));
      }, this);
  },
  actions: {
    removeSelected: function(item) {
        var idx = this.model.indexOf(item);
        if (idx !== -1) {
            map.getLayers().removeAt(idx);
        }
        this.model.removeObject(item);
    }
  }
});

Boundless.layersToModel = function(layers) {
    var model = [];
    for (var i =0, ii=layers.length; i<ii; ++i) {
        model.push(new Boundless.MapLayer(layers[i]));
    }
    return model;
};
