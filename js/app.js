App = Ember.Application.create();

App.MapLayer = Ember.Object.extend({
    title: null,
    visible: null,
    init: function(layer) {
        this.title = layer.get('title');
        this.visible = layer.get('visible');
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

App.Router.map(function() {
    // put your routes here
});

// create the OpenLayers Map and its layers
var map = new ol.Map({
    renderer: ol.RendererHint.CANVAS,
    layers: [new ol.layer.Tile({
        title: "Global Imagery",
        source: new ol.source.TileWMS({
            url: 'http://maps.opengeo.org/geowebcache/service/wms',
            params: {'LAYERS': 'bluemarble', 'VERSION': '1.1.1'}
        })
    }),
    new ol.layer.Vector({
        title: 'Countries',
        source: new ol.source.Vector({
            parser: new ol.parser.GeoJSON(),
            url: 'data/countries.json'
        })
    })],
    view: new ol.View2D({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 1
    })
});

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
      // bind the map to the div from the handlebars template
      map.set('target', 'map');
  }
});

App.LayerSwitcherComponent = Ember.Component.extend({
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

App.layersToModel = function(layers) {
    var model = [];
    for (var i =0, ii=layers.length; i<ii; ++i) {
        model.push(new App.MapLayer(layers[i]));
    }
    return model;
};

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return App.layersToModel(map.getLayers().getArray());
    }
});
