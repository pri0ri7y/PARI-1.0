require(["esriboot/bootstrapmap",
        "widget/polygonLoader",
        "widget/pointsLoader",
        "dojo/on",
        "dojo/dom",
        "esri/layers/GraphicsLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/dijit/Popup",
        "dojo/dom-construct",
        "dojo/domReady!"],
      function (BootstrapMap, MapPolygons, MapPoints, on, dom, GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol,Color,Popup,domConstruct) {
          

          //Info window 
          var popup = new Popup({
                pagingControls: false,
                pagingInfo: false,
                markerSymbol: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_PATH, 50,
                              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                              new Color([255, 0, 0]), 4),
                              new Color([0, 255, 0, 2])).setPath("M175.922,102.595c-1.414-38.698-32.553-69.841-71.255-71.251V0.004h-5.451v31.34" +
                                "c-38.698,1.414-69.838,32.553-71.255,71.251H0v5.443h27.962c1.417,38.702,32.557,69.845,71.255,71.258v26.985h5.451v-26.985" +
		                        "c38.702-1.417,69.841-32.557,71.255-71.258h30.363v-5.443H175.922z M170.471,108.038c-1.414,35.667-30.145,64.398-65.804,65.808" +
		                        "v-28.684h-5.451v28.684c-35.656-1.41-64.394-30.152-65.801-65.808h27.707v-5.443H33.416c1.41-35.653,30.145-64.387,65.801-65.801" +
		                        "V61.12h5.451V36.794c35.66,1.414,64.394,30.148,65.804,65.801h-25.302v5.443H170.471z")
                }, domConstruct.create("div"));
                              

          // Create map
          var map = BootstrapMap.create("mapDiv", {             
                center: [78.9629, 20.5937],
                basemap: "dark-gray",                
                showAttribution: false,
                zoom: 4,
                sliderPosition: "top-right",
                infoWindow: popup,
                scrollWheelZoom: true, 
          });

          map.on("load", function () {
                            
               var pointsGraphics = new GraphicsLayer();
               pointsGraphics.id = "pointsGraphics";

               var polygonGraphics = new GraphicsLayer();
               polygonGraphics.id = "polygonGraphics";         
               
               var mapPolygon = new MapPolygons({
                                                  polygonGraphics:polygonGraphics,
                                                  map:map
                                               });
               var mapPoints = new MapPoints({
                                                pointsGraphics:pointsGraphics,
                                                map:map
                                           });     

               // Add to map
               map.addLayers([polygonGraphics, pointsGraphics]);

                                                   
          });
           
      });