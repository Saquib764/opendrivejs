import PlanView from './PlanView'
import {THREE} from '../../util/three'

class Road{
	constructor(road){
		this.id = road.id[0]
		this.name = road.name[0]
		this.rule = road.rule[0]
		this.length = parseFloat(road.length[0])

		this.planView = new PlanView(road.planView[0])
		this.initialized = false
	}
	render(scene) {
		if( !this.initialized) {
			const line_material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
			const points = [];
			points.push( new THREE.Vector3( this.planView.geometry.x, this.planView.geometry.y, 0.01 ) );
			points.push( new THREE.Vector3( this.planView.geometry.x + this.planView.geometry.length, this.planView.geometry.y, 0.01 ) );
			const line_geometry = new THREE.BufferGeometry().setFromPoints( points );
			const line = new THREE.Line( line_geometry, line_material );

			const geometry = new THREE.PlaneGeometry( this.planView.geometry.length, 2 );
			geometry.translate(this.planView.geometry.length/2, 0, 0)
			const material = new THREE.MeshBasicMaterial( {color: 0x222222, side: THREE.DoubleSide} );
			const plane = new THREE.Mesh( geometry, material );

			scene.add(plane)
			scene.add( line );
			this.line = line
			this.plane = plane
		}
		this.initialized = true
	}
}

export default Road