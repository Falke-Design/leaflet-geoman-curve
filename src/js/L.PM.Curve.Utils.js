
const Utils = {
  // set new coords for the layer based in newCoords, based on current layer coords, ommiting non-coords elements (for curve)
  // new coords must be an array of L.LatLng
  reconciliateCoords(layer, newCoords) {
    let index = 0;
    // for curve, array is always one-dimensional (no nesting)
    if (newCoords.length == 1 && !newCoords[0].lat) newCoords = newCoords[0];
    layer.setLatLngs(
      layer.getLatLngs().map((point) => {
        if (typeof point === 'string') {
          return point;
        }
        const coords = [newCoords[index].lat, newCoords[index].lng];
        index += 1;
        return coords;
      })
    );

  },

  // retrieve the coordinates only from a curve definition, converting them to L.LatLng objects
  pathToCoordsOnly(curveLayer) {
    return curveLayer.getLatLngs().reduce((filtered, point) => {
      if (Array.isArray(point)) filtered.push(L.latLng(point));
      return filtered;
    }, []);
  },

  // returns points on the curve that correspond to the marker locations, converting them to L.LatLng
  getPointsOnCurve(curveLayer) {
    return curveLayer.getLatLngs().reduce((coords, command, index, allVals) => {
      if (
        Array.isArray(command) &&
        (index === allVals.length - 1 || !Array.isArray(allVals[index + 1]))
      ) {
        coords.push(L.latLng(command));
      }
      return coords;
    }, []);
  },

  getPointSymetric(ref, point) {
    const lat = 2 * ref[0] - point[0];
    const lng = 2 * ref[1] - point[1];
    return [lat, lng];
  },

  padBoundsByPixel: function (bounds, px) {
    var min = bounds.min,
      max = bounds.max,
      heightBuffer = Math.abs(min.x - max.x) + px,
      widthBuffer = Math.abs(min.y - max.y) + px;


    return L.bounds(
      L.point(min.x - heightBuffer, min.y - widthBuffer),
      L.point(max.x + heightBuffer, max.y + widthBuffer));
  },

  _calcLayerDistancesCurve(that, latlng, layer) {
    const map = that._map;

    var nw = map.getBounds().getNorthWest();
    var se = map.getBounds().getSouthEast();

    var bounds = L.PM.Curve.Utils.padBoundsByPixel(L.bounds([map.latLngToLayerPoint(nw),map.latLngToLayerPoint(se)]),25);

    var point = map.latLngToLayerPoint(latlng);
    if (!bounds.contains(point)) {
      return { ...latlng };
    }

    if (that.options.snapSegment) {
      // TODO: import module
      var path = SVGPathCommander.parsePathString(
        layer._path.attributes.d.value
      );

      var properties = SVGPathCommander.getPropertiesAtPoint(path, point);
      var clostestLatLng = map.layerPointToLatLng(properties.closest);
      var segment;
      if (properties.segment && properties.segment.index > 0) {
        var lastSegement = path[properties.segment.index - 1];
        var currentSegement = properties.segment.segment;

        segment = [];
        segment.push(lastSegement.slice(lastSegement.length - 2));
        segment.push(currentSegement.slice(currentSegement.length - 2));
        segment = segment.map((p) => map.layerPointToLatLng(p));
      }

      return {
        latlng: clostestLatLng,
        distance: properties.distance,
        segment,
      };
    } else {
      return that._calcLayerDistances(latlng, layer);
    }
  },

};

export default Utils;
