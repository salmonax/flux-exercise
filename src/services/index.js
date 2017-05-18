import config from './config';

// Warning: these depend on global header includes in index.html; switch
// Note: trying to isolate these here, so components don't depend on anything magical
export const sdk = new FluxSdk(config.flux_client_id, {
  redirectUri: config.url,
  fluxUrl: config.flux_url
});
export const helpers = new FluxHelpers(sdk);

export const viewport = {
  create: (selector) => { 
    let viewport = new FluxViewport(document.querySelector(selector));
    viewport.setupDefaultLighting();
    viewport.setClearColor(0xffffff);
    return viewport;
  }
}



// var user = null
// var dataTables = {}

// /**
//  * Get a specific project cell (key).
//  */
// function getCell(project, cell) {
//   return getDataTable(project).table.getCell(cell.id)
// }

// /**
//  * Get the value contained in a cell (key).
//  */
// function getValue(project, cell) {
//   return getCell(project, cell).fetch()
// }

// /**
//  * Get a project's data table.
//  */
// function getDataTable(project) {
//   if (!(project.id in dataTables)) {
//     var dt = getUser().getDataTable(project.id)
//     dataTables[project.id] = { table: dt, handlers: {}, websocketOpen: false }
//   }
//   return dataTables[project.id]
// }

// /**
//  * Get a list of the project's cells (keys).
//  */
// function getCells(project) {
//   return getDataTable(project).table.listCells()
// }


// /**
//  * Get the Flux user.
//  */
// function getUser() {
//   if (!user) {
//     user = helpers.getUser()
//   }
//   return user
// }

// /**
//  * Get the user's Flux projects.
//  */
// function getProjects() {
//   return getUser().listProjects()
// }