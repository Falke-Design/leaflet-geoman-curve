import 'cypress-wait-until';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('hasLayers', (count) => {
  cy.window().then(({ map }) => {
    const layerCount = Object.keys(map._layers).length;
    cy.wrap(layerCount).should('eq', count);
  });
});

Cypress.Commands.add('hasDrawnLayers', (count) => {
  cy.window().then(({ map }) => {
    const layerCount = Object.keys(map._layers).filter(
      (l) => map._layers[l]._drawnByGeoman
    ).length;
    cy.wrap(layerCount).should('eq', count);
  });
});

Cypress.Commands.add('testLayerAdditionPerformance', () => {
  let t0;

  cy.window().then(({ map, L }) => {
    t0 = performance.now();

    function getRandomLatLng() {
      const bounds = map.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const lngSpan = northEast.lng - southWest.lng;
      const latSpan = northEast.lat - southWest.lat;

      return new L.LatLng(
        southWest.lat + latSpan * Math.random(),
        southWest.lng + lngSpan * Math.random()
      );
    }

    const terminals = [];
    const locations = [];

    for (let i = 0; i < 3500; i += 1) {
      locations.push(L.circleMarker(getRandomLatLng(map)));
    }

    for (let i = 0; i < 2500; i += 1) {
      terminals.push(L.circleMarker(getRandomLatLng(map)));
    }

    const t = L.layerGroup(terminals).addTo(map);
    const l = L.layerGroup(locations).addTo(map);

    const base = {};

    const overlays = {
      Locations: t,
      Terminals: l,
    };

    L.control.layers(base, overlays).addTo(map);
  });

  cy.window().then(() => {
    const t1 = performance.now();
    const delta = Math.abs(t1 - t0);
    console.log(`Rendering 6k CircleMarkers took ${delta} milliseconds.`);

    expect(delta).to.lessThan(1000);
  });
});

Cypress.Commands.add('hasMiddleMarkers', (count) => {
  cy.get('.marker-icon-middle').should(($p) => {
    expect($p).to.have.length(count);
  });
});

Cypress.Commands.add('hasVertexMarkers', (count) => {
  cy.get('.marker-icon:not(.marker-icon-middle)').should(($p) => {
    expect($p).to.have.length(count);
  });
});

Cypress.Commands.add('hasTotalVertexMarkers', (count) => {
  cy.get('.marker-icon').should(($p) => {
    expect($p).to.have.length(count);
  });
});

Cypress.Commands.add('toolbarButton', (name) =>
  cy.get(`.leaflet-pm-icon-${name}`)
);

Cypress.Commands.add('toolbarButtonContainer', (name, map) => {
  cy.get(map.pm.Toolbar.buttons[name]._container.children[0]);
});
