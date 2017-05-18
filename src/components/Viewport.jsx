import React from 'react';
import box from '../fixtures/box';
import { viewport } from '../services';
import CellSelector from './CellSelector';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);
    this.viewport = null;
  }
  componentDidMount() {
    this.viewport = viewport.create('#view');
    this.viewport.setGeometryEntity(box);
    // console.log(this.viewport._latestSceneResults);
    this._initViewportEvents();
  }
  // Note: would rather this be elsewhere, but it'll do the job for now
  _initViewportEvents() {
    // Note: brittle and not coded to interface
    const { _domParent, _cameras, _scene } = this.viewport._renderer;
    const node = _domParent;
    const camera = _cameras.getCamera();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const meshesParent = this.viewport._renderer._scene.children[1];
      console.log(this.viewport._renderer._scene);
      if (!meshesParent) return;
      const meshes = meshesParent.children;
      mouse.x = ( (event.offsetX+1) / node.clientWidth ) * 2 - 1;
      mouse.y = - ( (event.offsetY+1) / node.clientHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, camera );
      console.log(meshes);
      var intersects = raycaster.intersectObjects( meshes );
      // console.log(intersects);
      // Toggle rotation bool for meshes that we clicked
      if ( intersects.length > 0 ) {
        console.log(intersects[0]);
      }
    }
    node.addEventListener('mousemove',onMouseMove,false);
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
