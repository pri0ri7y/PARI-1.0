define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/SpatialReference",
    "esri/Color"
], function (declare, lang, on, Graphic, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, SpatialReference, Color) {
    return declare([], {

        // Required Terrformer library reference
        _terrafomer: (typeof Terraformer !== 'undefined') ? Terraformer : null,

        _url: "assets/state.json",
        constructor: function (options) {

            this.graphicLayer = options.polygonGraphics;
            this.map = options.map;

            this._simplePolygonSym = new SimpleFillSymbol("solid",
                    new SimpleLineSymbol("solid", new Color([57, 255, 20, 0.6]), 2),
                    new Color([75, 202, 67, 0.15]));

            this._simplePolygonSymHvr = new SimpleFillSymbol("solid",
                    new SimpleLineSymbol("solid", new Color([57, 255, 20, 0.6]), 2),
                    new Color([137, 243, 130, 0.4]));

            this._inSpatialReference = new SpatialReference({ wkid: 4326 });

            this.addPolygonLayer();

            on(this.graphicLayer, "mouse-over", lang.hitch(this, this.graphicHover));
            on(this.graphicLayer, "mouse-out", lang.hitch(this, this.graphicOut));
            on(this.graphicLayer, "click", lang.hitch(this, this.graphicClick));


        },

        // adding polygon
        addPolygonLayer: function () {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', this._url, true);
            xobj.onreadystatechange = lang.hitch(this, function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    this.callback(xobj.responseText);
                }
            });
            xobj.send(null);
        },
        callback: function (responseText) {
            var geojson = JSON.parse(responseText);

            var json,
                arcgisJson;
            // Convert the geojson object to a Primitive json representation
            json = new this._terrafomer.Primitive(geojson);
            // Convert to ArcGIS JSON
            arcgisJson = this._terrafomer.ArcGIS.convert(json);

            for (var i = 0; i < arcgisJson['length']; i++) {

                var feature = arcgisJson[i];
                // Create graphic - magically sets the geometry type!
                graphic = this._createGraphic(feature);
                // Add to layer
                this.graphicLayer.add(graphic);
            }

        },
        _createGraphic: function (arcgisJson) {
            var graphic;

            // This magically sets geometry type!
            graphic = new Graphic(arcgisJson);

            // Set the correct symbol based on type and render - NOTE: Only supports simple renderers                
            graphic.setSymbol(this._simplePolygonSym);

            // Update SR because terraformer sets incorrect spatial reference
            graphic.geometry.setSpatialReference(this._inSpatialReference); // NOTE: Has to match features!
            return graphic;
        },

        // on hover + on out evt handler
        graphicHover: function (e) {

            e['graphic'].setSymbol(this._simplePolygonSymHvr);
            this.map.setMapCursor("pointer");

        },
        graphicOut: function (e) {
            e['graphic'].setSymbol(this._simplePolygonSym);
            this.map.setMapCursor("default");
        },

        // on click event
        graphicClick: function (e) {
            this.map.infoWindow.hide();
            this.map.infoWindow.setTitle("State");
            this.map.infoWindow.setContent(e['graphic']['attributes']['ST_NM']);
            this.map.infoWindow.set("anchor", "auto");             
            this.map.infoWindow.show(e.mapPoint);
        }

    });
});
