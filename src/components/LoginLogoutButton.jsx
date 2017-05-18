import React from 'react';

const LoginLogoutButton = (props) => {
  return (
    <div id='logout' onClick={props.toggle}>
      {props.isLoggedIn ? 'Logout' : 'Login' }
    </div>
  )
}

export default LoginLogoutButton;
