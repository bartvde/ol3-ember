Ember.RadioButton = Ember.View.extend({
    tagName : "input",
    type : "radio",
    attributeBindings : [ "name", "type", "value", "checked:checked:" ],
    click : function() {
        this.set("selection", this.$().val());
    },
    checked : function() {
       return this.get("value") == this.get("selection");   
    }.property()
});

Boundless = Ember.Namespace.create({
  VERSION: '0.1.0'
});

Boundless.MapLayer = Ember.Object.extend({
    title: null,
    visible: null,
    group: null,
    exclusive: false,
    init: function(layer) {
        this.title = layer.get('title');
        this.visible = layer.get('visible');
        this.group = layer.get('group');
        this.exclusive = layer.get('exclusive');
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
      this.addObserver('selected', function(evt) {
          var group = evt.get('group');
          var title = evt.get('selected');
          this.model.forEach(function(item) {
              if (item.get('group') === group) {
                  item.set('visible', (item.get('title') === title));
              }
          });
      });
      var lc = this.map.getLayers();
      // if an item is removed from the layers collection, update our view
      lc.on('remove', function(evt) {
          var el = evt.element;
          this.model.removeObject(this.model.findBy('title', el.get('title')));
      }, this);
  },
  actions: {
    removeSelected: function(item) {
        var title = item.get('title'), idx;
        this.map.getLayers().forEach(function(el, index) {
            if (el.get('title') === title) {
                idx = index;
            }
        });
        this.map.getLayers().removeAt(idx);
    }
  }
});

Boundless.layersToModel = function(layers) {
    var model = [];
    for (var i = layers.length-1; i >= 0; --i) {
        model.push(new Boundless.MapLayer(layers[i]));
    }
    return model;
};
