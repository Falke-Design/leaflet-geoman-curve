import './Draw/L.PM.Draw.Curve';
import './Edit/L.PM.Edit.Curve';
import '../css/style.css';
import Utils from './L.PM.Curve.Utils';
import { insertTranslations } from '../assets/translations';

L.PM.Curve = L.Class.extend({
  initialize(map) {
    // save the map
    this._map = map;

    insertTranslations();

    map.pm._allowedTypes.push(L.Curve);
    map.pm._allowedSnappingTypes.push(L.Curve);
    map.pm._allowedRotateTypes.push(L.Curve);
    map.pm._latlngFunctions.push({
      type: L.Curve,
      fnc: L.PM.Curve.Utils.pathToCoordsOnly,
    });
    map.pm._latlngRotationOverlayFunctions.push({
      type: L.Curve,
      fnc: L.PM.Curve.Utils.getPointsOnCurve,
    });
    map.pm._snappingFilters.push(
      (layer) => layer instanceof L.Curve && layer._coords
    );
    map.pm._snappingDistanceFunctions.push({
      type: L.Curve,
      fnc: L.PM.Curve.Utils._calcLayerDistancesCurve,
    });

    const drawCurveButton = {
      name: 'Curve',
      title: L.PM.Translation.getTranslation('buttonTitles.drawCurveButton'),
      className: 'control-icon leaflet-pm-icon-curve',
      onClick: () => {},
      afterClick: (e, ctx) => {
        // toggle drawing mode
        map.pm.Toolbar.map.pm.Draw[ctx.button._button.jsClass].toggle();
      },
      block: 'draw',
      actions: ['finish', 'removeLastVertex', 'cancel'],
    };
    map.pm.Draw.createNewDrawInstance('Curve', 'Curve');
    map.pm.Toolbar.createCustomControl(drawCurveButton);

    function initCurve() {
      this.pm = undefined;
      if (L.PM.optIn) {
        if (this.options.pmIgnore === false) {
          this.pm = new L.PM.Edit.Curve(this);
        }
      } else if (!this.options.pmIgnore) {
        this.pm = new L.PM.Edit.Curve(this);
      }
    }

    L.Curve.addInitHook(initCurve);
  },
});

L.PM.Curve.Utils = Utils;
