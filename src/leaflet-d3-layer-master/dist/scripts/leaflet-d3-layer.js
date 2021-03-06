// Generated by CoffeeScript 1.6.1
(function() {
  var root;

  root = this;

  L.GeoJSON.d3 = L.GeoJSON.extend({
    initialize: function(geojson, options) {
      this.geojson = geojson;
      options = options || {};
      options.layerId = options.layerId || ("leaflet-d3-layer-" + (Math.floor(Math.random() * 101)));
      options.onEachFeature = function(geojson, layer) {};
      L.setOptions(this, options);
      return this._layers = {};
    },
    updateData: function(map) {
      var bounds, feature, g, join, path, paths, project, reset, styler, svg;
      g = this._g;
      svg = this._svg;
      if (this.geojson.type === "Topology") {
        this.geojson = root.topojson.feature(this.geojson, this.geojson.objects.features);
      }
      paths = g.selectAll("path");
      join = paths.data(this.geojson.features, function(d) {
        return d.id;
      });
      feature = join.enter().append("path");
      join.exit().remove();
      if (this.options.styler != null) {
        styler = this.options.styler;
        feature.attr("styler", function(d) {
          return d.properties[styler];
        });
      }
      project = function(d3pnt) {
        var geoPnt, pixelPnt;
        geoPnt = new L.LatLng(d3pnt[1], d3pnt[0]);
        pixelPnt = map.latLngToLayerPoint(geoPnt);
        return [pixelPnt.x, pixelPnt.y];
      };
      path = d3.geo.path().projection(project);
      bounds = d3.geo.bounds(this.geojson);
      reset = function() {
        var bottomLeft, bufferPixels, topRight;
        bufferPixels = 15;
        bottomLeft = project(bounds[0]);
        topRight = project(bounds[1]);
        svg.attr("width", topRight[0] - bottomLeft[0] + 2 * bufferPixels);
        svg.attr("height", bottomLeft[1] - topRight[1] + 2 * bufferPixels);
        svg.style("margin-left", "" + (bottomLeft[0] - bufferPixels) + "px");
        svg.style("margin-top", "" + (topRight[1] - bufferPixels) + "px");
        g.attr("transform", "translate(" + (-bottomLeft[0] + bufferPixels) + "," + (-topRight[1] + bufferPixels) + ")");
        return feature.attr("d", path);
      };
      map.on("viewreset", reset);
      reset();
      return this.resetFunction = reset;
    },
    onAdd: function(map) {
      var d3Selector, g, overlayPane, svg;
      overlayPane = map.getPanes().overlayPane;
      d3Selector = d3.select(overlayPane);
      this._svg = svg = d3Selector.append("svg");
      svg.attr("class", "leaflet-d3-layer");
      svg.attr("id", this.options.layerId);
      this._g = g = svg.append("g");
      g.attr("class", "leaflet-zoom-hide leaflet-d3-group");
      return this.updateData(map);
    },
    onRemove: function(map) {
      this._svg.remove();
      return map.off("viewreset", this.resetFunction);
    }
  });

  L.GeoJSON.d3.async = L.GeoJSON.d3.extend({
    initialize: function(geojsonUrl, options) {
      this.geojsonUrl = geojsonUrl;
      options = options || {};
      options.layerId = options.layerId || geojsonUrl.replace(/[^A-Za-z0-9]/g, "-");
      return L.GeoJSON.d3.prototype.initialize.call(this, null, options);
    },
    getData: function(map) {
      var mapBounds, thisLayer, url;
      mapBounds = map.getBounds().toBBoxString();
      url = "" + this.geojsonUrl + "&bbox=" + mapBounds;
      thisLayer = this;
      return d3.json(url, function(geojson) {
        thisLayer.geojson = geojson;
        if (thisLayer._svg != null) {
          return L.GeoJSON.d3.prototype.updateData.call(thisLayer, map);
        } else {
          return L.GeoJSON.d3.prototype.onAdd.call(thisLayer, map);
        }
      });
    },
    onAdd: function(map) {
      var newData, thisLayer;
      thisLayer = this;
      this.newData = newData = function(e) {
        return L.GeoJSON.d3.async.prototype.getData.call(thisLayer, e.target);
      };
      map.on("moveend", newData);
      return this.getData(map);
    },
    onRemove: function(map) {
      L.GeoJSON.d3.prototype.onRemove.call(this, map);
      return map.off("moveend", this.newData);
    }
  });

}).call(this);
