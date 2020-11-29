import Road from './Road'
import Header from './Header'


class OpenDrive {
	private _xodr_json: any;
	_simplified_json: any
	road: 				[Road]
	constructor(xodr_json:any) {
		this._xodr_json = xodr_json.OpenDRIVE
		console.log(this._xodr_json.road[0].lanes[0].laneSection)
		let {header, road} = this.simplify_json(this._xodr_json)
		console.log(road[0].lanes.laneSection)
		this.road = road
	}

	simplify_json(xodr_json:any){
		let header = new Header(xodr_json.header[0])
		let road = xodr_json.road.map((r:any)=>new Road(r))
		return {header, road}
	}
	render(THREE:any, scene:any) {
		this.road.map((r:Road)=> r.render(THREE, scene))
	}
}


export default OpenDrive