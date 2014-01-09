App = Ember.Application.create();

App.LayerSwitcherComponent = Boundless.LayerSwitcherComponent;

App.Router.map(function() {
    this.route("about");
});

// create the OpenLayers Map and its layers
var map = new ol.Map({
    renderer: ol.RendererHint.CANVAS,
    layers: [new ol.layer.Tile({
        title: "Streets",
        visible: false,
        group: "Basemaps",
        exclusive: true,
        source: new ol.source.MapQuestOSM()
    }),
    new ol.layer.Tile({
        title: "Aerial",
        group: "Basemaps",
        exclusive: true,
        visible: true,
        source: new ol.source.MapQuestOpenAerial()
    }),
    new ol.layer.Vector({
        title: 'Boroughs',
        group: 'Overlay Layers',
        style: new ol.style.Style({symbolizers: [
            new ol.style.Stroke({
                color: 'black',
                width: 4,
                opacity: 1
            })
        ]}),
        source: new ol.source.Vector({
            parser: new ol.parser.GeoJSON(),
            url: 'data/boroughs.geojson'
        })
    })],
    view: new ol.View2D({
        center: ol.proj.transform(
            [-73.979378, 40.702222], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10
    })
});

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
      // bind the map to the div from the handlebars template
      map.set('target', 'map');
      map.updateSize();
  }
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return Boundless.layersToModel(map.getLayers().getArray());
    }
});

App.IndexController = Ember.ArrayController.extend(Ember.GroupableMixin, {
  groupBy: 'group'
});
