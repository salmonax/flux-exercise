import React from 'react';
import { helpers, viewport } from '../services/index.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      projects: [],
      cells: [],
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
      this.setState({ cells });
    }); 
  }

  handleCellSelection(e) {
    const cell = this.state.cells.filter(cell => cell.label === e.target.value)[0];
    if (!cell || !this.dataTable) return;
    this.dataTable.getCell(cell.id).fetch()
      .then(data => viewport.render(data) );
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

const LoginLogoutButton = (props) => {
  return (
    <div id='logout' onClick={props.toggle}>
      {props.isLoggedIn ? 'Logout' : 'Login' }
    </div>
  )
}

const ProjectSelector = (props) => {
  return (
    <div className='select'>
      <select className='project' onChange={props.select}>
        <option>Please select a project</option>
        {props.projects.map(project => 
          <option key={project.id}>{project.name}</option>
        )}
      </select>
    </div>
  );
}

const CellSelector = (props) => {
  return (
    <div className='select' onChange={props.select}>
      <select className='cell'>
        <option>Please select a cell</option>
        {props.cells.map(cell =>
          <option key={cell.id}>{cell.label}</option>
        )}
      </select>
    </div>
  );
};

const NavBar = (props) => {
  return (
    <div id='header'>
      <div id='title'>
        <h1>FLUX</h1>
        <h2>Exercise Project</h2>
      </div>
      <div id='actions'>
        {props.isLoggedIn ? <ProjectSelector projects={props.projects} select={props.select} /> : null}
        <LoginLogoutButton isLoggedIn={props.isLoggedIn} toggle={props.toggle} />
      </div>
    </div>
  )
};

// import { viewport } from '../services/index.js';
import box from '../fixtures/box';

class Viewport extends React.Component {
  constructor(props) {
    super(props);
    this.viewport = null;
  }
  componentDidMount() {
    this.viewport = viewport.create('#view');
    this.viewport.setGeometryEntity(box);
    console.log('!!!',this.viewport._renderer);
    console.log(this.viewport.homeCamera());
  }
  render() {
    return (
      <div id='content'>
        <div className='column'>
          <div id='output'>
            <div className='label'>From Flux</div>
            <div id='geometry'>
              <div id='view'></div>
            </div>
            <div id='display'>
              <div className='content'></div>
            </div>
            <CellSelector cells={this.props.cells} select={this.props.select}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;