App = Ember.Application.create();

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

App.IndexController = Ember.ArrayController.extend({
  init: function() {
    var lc = map.getLayers();
    // if an item is removed from the layers collection, update our view
    lc.on('remove', function(evt) {
        var el = evt.getElement();
        this.removeObject(this.findBy('title', el.get('title')));
    }, this);
    var layers = lc.getArray();
    for (var i =0, ii=layers.length; i<ii; ++i) {
        var layer = layers[i];
        var obj = Ember.Object.create({
            title: layer.get('title'),
            visible: layer.get('visible')
        });
        // if the visible checkbox is used, update our layer object
        obj.addObserver('visible', layer, function(evt) {
            this.set('visible', evt.get('visible'));
        });
        this.pushObject(obj);
        // if our layer's title is changed, update our Ember object
        layer.on('change:title', function(evt) {
            this.set('title', evt.target.get('title'));
        }, obj);
        // if our layer's visible property is changed, update our Ember object
        layer.on('change:visible', function(evt) {
            this.set('visible', evt.target.get('visible'));
        }, obj);
    }
  },
  actions: {
    removeSelected: function(item) {
      var idx = this.indexOf(item);
      if (idx !== -1) {
          map.getLayers().removeAt(idx);
      }
      this.removeObject(item);
    }
  }
});

App.IndexRoute = Ember.Route.extend({});
