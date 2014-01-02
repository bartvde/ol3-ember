App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

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
      map.set('target', 'map');
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return map.getLayers().getArray();
  }
});

Ember.Handlebars.helper('get-title', function(layer) {
  return layer.get('title');
});
