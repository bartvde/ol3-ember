App = Ember.Application.create();

App.LayerSwitcherComponent = Boundless.LayerSwitcherComponent;

App.Router.map(function() {
    this.route("about");
});

App.Map = new ol.Map({
    renderer: ol.RendererHint.CANVAS,
    layers: [new ol.layer.Tile({
        title: "Streets",
        group: "Basemaps",
        exclusive: true,
        source: new ol.source.MapQuest({layer: 'osm'})
    }),
    new ol.layer.Tile({
        title: "Aerial",
        group: "Basemaps",
        exclusive: true,
        visible: false,
        source: new ol.source.MapQuest({layer: 'sat'})
    }),
    new ol.layer.Vector({
        title: 'Zoning',
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
            url: 'data/medford-zoning.json'
        })
    })],
    view: new ol.View2D({
        center: ol.proj.transform(
            [-122.85676399771559, 42.3389246879193], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12
    })
});

App.IndexView = Ember.View.extend({
  didInsertElement: function() {
      // bind the map to the div from the handlebars template
      App.Map.set('target', 'map');
      App.Map.updateSize();
  }
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return Boundless.layersToModel(App.Map.getLayers().getArray());
    }
});

App.IndexController = Ember.ArrayController.extend(Ember.GroupableMixin, {
  groupBy: 'group'
});
