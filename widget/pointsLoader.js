define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color"
], function (declare, lang, on, Graphic, Point, SimpleMarkerSymbol, SimpleLineSymbol, Color) {
    return declare([], {
        _url: "assets/points.json",
        constructor: function (options) {
            this.graphicLayer = options.pointsGraphics;
            this.map = options.map;
            this.addPointLayer();


            this.symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 6, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL,
                                                                                                    new Color([75, 0, 30, 0.9]), 0.5),
                                                                                                    new Color([75, 0, 30, 0.9]));


            this.symbolhvr = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL,
                                                                                                    new Color([75, 0, 30, 0.9]), 0.5),
                                                                                                    new Color([75, 0, 30, 0.9]));

            on(this.graphicLayer, "mouse-over", lang.hitch(this, this.graphicHover));
            on(this.graphicLayer, "mouse-out", lang.hitch(this, this.graphicOut));
            on(this.graphicLayer, "click", lang.hitch(this, this.graphicClick));
        },
        addPointLayer: function () {
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
            var json = JSON.parse(responseText);
            for (var i = 0; i < json['length']; i++) {

                var pt = new Point(json[i]['latLng'][1], json[i]['latLng'][0]);
                var attr = { "id": json[i]['id'] };
                var gr = new Graphic(pt, this.symbol, attr);

                this.graphicLayer.add(gr);
            }
        },

        // on hover + on out evt handler
        graphicHover: function (e) {

            e['graphic'].setSymbol(this.symbolhvr);
            this.map.setMapCursor("pointer");

        },

        graphicOut: function (e) {
            e['graphic'].setSymbol(this.symbol);
            this.map.setMapCursor("default");
        },

        // on click event
        graphicClick: function (e) {

            this._ajaxUrl = "http://map.pri0ri7y.com/ip.php?id=" + e['graphic']['attributes']['id'];
            var xobj = new XMLHttpRequest();
            //xobj.overrideMimeType("application/json");
            xobj.open('GET', this._ajaxUrl, true);
            xobj.onreadystatechange = lang.hitch(this, function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    var obj = JSON.parse(xobj.responseText);
                    this.map.infoWindow.hide();
                    this.map.infoWindow.setTitle(obj['title']);
                    var _bhref = 'http://www.old.ruralindiaonline.org/';
                    var cnt = '<div><ul class="nav nav-list">' +
                                '<li class="nav-header">Articles</li>' +
                                '<li><a href="' + _bhref + obj['articles'][0]['link'] + '" target="_blank">' + obj['articles'][0]['title'] + '</a></li>' +
                                '<li class="divider"></li>' +
                                '<li><a href="' + _bhref + obj['link'] + '" target="_blank" >View more content for ' + obj['title'] + '</a></li>' + '</ul></div>';

                    this.map.infoWindow.setContent(cnt);
                    this.map.infoWindow.set("anchor", "auto");
                    this.map.infoWindow.show(e.mapPoint);
                }
            });
            xobj.send(null);
        }

    });
});
