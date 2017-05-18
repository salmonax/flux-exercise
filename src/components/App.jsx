import React from 'react';
import { helpers, viewport } from '../services';
import NavBar from './NavBar';
import Viewport from './Viewport';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      projects: [],
      cells: [],
      cellDetails: [],
    };
    this.dataTable = null;
    // Bleh, should add stage-2 to lexically scope methods at some point
    this.handleLogin = this.handleLogin.bind(this); 
    this.handleLogout = this.handleLogout.bind(this);
    this.handleProjectSelection = this.handleProjectSelection.bind(this);
    this.handleCellSelection = this.handleCellSelection.bind(this);
  }

  componentDidMount() {
    // Check if we're coming back from Flux with the login credentials.
    helpers.storeFluxUser()
      .then(() => helpers.getUser().listProjects())
      .then(data => {
        const projects = data.entities;
        this.setState({
          isLoggedIn: helpers.isLoggedIn(),
          projects,
        });
      });
  }

  handleLogin() {
    // Doesn't require state change; state is set on redirect, from helper
    helpers.redirectToFluxLogin();
  }

  handleLogout() {
    helpers.logout();
    this.setState({
      isLoggedIn: false,
    })
  }

  handleProjectSelection(e) {
    // Note: seems kludgy, probably a better way
    const project = this.state.projects.filter(project => project.name === e.target.value)[0];
    if (!project) { 
      this.dataTable = null;
      this.setState({ cells: [] });
      return;
    }
    this.dataTable = helpers.getUser().getDataTable(project.id);
    this.dataTable.listCells().then(data => {
      const cells = data.entities;
      this.setState({ cells: cells });
    }); 
  }

  handleCellSelection(e) {
    const cell = this.state.cells.filter(cell => cell.label === e.target.value)[0];
    if (!cell || !this.dataTable) return;
    this.dataTable.getCell(cell.id).fetch()
      .then(data => {
        this.setState({ cellDetails: data.value });
        viewport.render(data) 
      });
  }

  render() {
    const { isLoggedIn, projects, cells } = this.state;
    const toggle = isLoggedIn ? this.handleLogout : this.handleLogin;
    return (
      <div id='container' className="ui container">
        <NavBar 
          isLoggedIn={isLoggedIn} 
          toggle={toggle} 
          projects={projects} 
          select={this.handleProjectSelection} 
        />
        { this.state.isLoggedIn ? 
            <Viewport 
              user={this.state.user}
              cells={cells}
              select={this.handleCellSelection}
            /> :
            <div id='splash'>
              Please Log in!
            </div>
        }
      </div>
    );
  }
}

export default App;
