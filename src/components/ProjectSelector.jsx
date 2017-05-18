import React from 'react';

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
export default ProjectSelector;