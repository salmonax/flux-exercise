import config from './config';

const flatten = (array) => 
  array.reduce((a, b) => 
    a.concat(Array.isArray(b) ? flatten(b) : b), []);

// Warning: these depend on global header includes in index.html; switch
// Note: trying to isolate these here, so components don't depend on anything magical
export const sdk = new FluxSdk(config.flux_client_id, {
  redirectUri: config.url,
  fluxUrl: config.flux_url
});
export const helpers = new FluxHelpers(sdk);

var _viewport;
export const viewport = {
  create: (selector) => { 
    _viewport = new FluxViewport(document.querySelector(selector));
    _viewport.setupDefaultLighting();
    _viewport.setClearColor(0xffffff);
    return _viewport;
  },
  render: (data) => {
    const transformGeo = (item) => {
      if (item.primitive === 'revitElement') {
        return item.geometryParameters.geometry;
      } else {
        return item;
      }
    };
    if (!_viewport) return;
    if (!data) {
      console.log('Warning: Ignoring empty data for now');
    }
    else if (Array.isArray(data.value)) {
      let flat = flatten(data.value);
      let output = [];
      flat.forEach(item => {
        if (item.primitive === 'revitElement') {
          let meshId = item.instanceParameters.UniqueId;
          let meshItem = item.geometryParameters.geometry;
          meshItem.id = meshId;
          meshItem.attributes = item.instanceParameters;
          let instanceItem = {
            primitive: "layer",
            id: item.fluxId,
            entity: meshId,
            attributes: item.instanceParameters,
          };
          output.push(meshItem);
          output.push(instanceItem);
        } else if (FluxViewport.isKnownGeom(item)) {
          output.push(item);
        }
      });
      _viewport.setGeometryJson(JSON.stringify(output)).then(results => console.log('!!',results));
    }
    //check to see if the data is a known type of geometry
    else if (FluxViewport.isKnownGeom(data.value)) {
      _viewport.setGeometryEntity(data.value)
    } else {
      console.log=('Warning: Ignoring non-geometric data for now');
    }

  }
};
