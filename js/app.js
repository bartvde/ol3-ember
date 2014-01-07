App = Ember.Application.create();

App.LayerSwitcherComponent = Boundless.LayerSwitcherComponent;

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

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return Boundless.layersToModel(map.getLayers().getArray());
    }
});
