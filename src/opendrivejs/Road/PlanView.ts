import * as Util from '../util'

export default class PlanView{
	geomtery:		[Geometry]
	initialized: 	boolean = false
	constructor(data:any) {
		this.geomtery = data.geometry.map((g:any)=> new Geometry(g))
	}
	render(THREE:any, scene:any) {
		this.geomtery.map((g:Geometry)=> g.render(THREE, scene))
	}
}

class Geometry {
	s:				number
	x:				number
	y: 				number
	hdg: 			number
	length: 		number
	type: 			string = 'LINE'
	initialized:	boolean = false
	constructor(data:any) {
		this.s = Util.make_double(data.s, 0)
		this.x = Util.make_double(data.x, 0)
		this.y = Util.make_double(data.y, 0)
		this.hdg = Util.make_double(data.hdg, 0)
		this.length = Util.make_double(data.length, 0)
		if(data.line) {
			this.type = "LINE"
		}
	}
	render(THREE:any, scene:any) {
		if(!this.initialized) {
			const line_material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
			const points = [];
			points.push( new THREE.Vector3( this.x, this.y, 0.01 ) );
			points.push( new THREE.Vector3( this.x + this.length, this.y, 0.01 ) );
			const line_geometry = new THREE.BufferGeometry().setFromPoints( points );
			const line = new THREE.Line( line_geometry, line_material );

			// const geometry = new THREE.PlaneGeometry( this.length, 2 );
			// geometry.translate(this.length/2, 0, 0)
			// const material = new THREE.MeshBasicMaterial( {color: 0x222222, side: THREE.DoubleSide} );
			// const plane = new THREE.Mesh( geometry, material );

			// scene.add(plane)
			scene.add( line );
		}
		this.initialized = true
	}
}
