const Utils = {
    // set new coords for the layer based in newCoords, based on current layer coords, ommiting non-coords elements (for curve)
    // new coords must be an array of L.LatLng
    reconciliateCoords(layer, newCoords) {
        let index = 0;
        // for curve, array is always one-dimensional (no nesting)
        if (newCoords.length == 1 && !newCoords[0].lat) newCoords = newCoords[0];
        layer.setLatLngs(layer.getLatLngs().map(point => {
            if (typeof point === 'string'){
                return point;
            }
            const coords = [newCoords[index].lat, newCoords[index].lng];
            index += 1;
            return coords;
        }));
    },

    // retrieve the coordinates only from a curve definition, converting them to L.LatLng objects
    pathToCoordsOnly(curveLayer) {
        return curveLayer.getLatLngs().reduce((filtered, point) => {
            if (Array.isArray(point)) filtered.push(L.latLng(point))
            return filtered
        }, []);
    },

    // returns points on the curve that correspond to the marker locations, converting them to L.LatLng
    getPointsOnCurve(curveLayer) {
        return curveLayer.getLatLngs().reduce((coords, command, index, allVals) => {
            if (Array.isArray(command) && (index === (allVals.length - 1) || !Array.isArray(allVals[index + 1]))) {
                coords.push(L.latLng(command));
            }
            return coords;
        }, []);
    },

    getPointSymetric(ref, point) {
        const lat = 2 * ref[0] - point[0];
        const lng = 2 * ref[1] - point[1];
        return [lat, lng]
    }
};

export default Utils;
