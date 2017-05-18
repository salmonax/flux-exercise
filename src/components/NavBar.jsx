import React from 'react';
import LoginLogoutButton from './LoginLogoutButton';
import ProjectSelector from './ProjectSelector';

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

export default NavBar;