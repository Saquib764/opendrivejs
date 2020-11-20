import Road from './Road'

class OpenDrive {
	constructor(xodr_json){
		this._xodr_json = xodr_json.OpenDRIVE
		console.log(this._xodr_json.road[0])
	}
	get header(){
		return this.parse_header(this._xodr_json.header[0]);
	}

	get road(){
		return this._xodr_json.road.map(r=>this.parse_road(r))
	}

	parse_header(header){
		let revMajor = header.revMajor[0]
		let revMinor = header.revMinor[0]
		let name = header.name[0]
		let version = header.version[0]
		let date = header.date[0]
		let north = parseFloat(header.north[0])
		let south = parseFloat(header.south[0])
		let east = parseFloat(header.east[0])
		let west = parseFloat(header.west[0])

		return {
			revMajor,
			revMinor,
			name,
			version,
			date,
			north, south, east, west,
		}
	}
	parse_road(road){
		return new Road(road)
	}
}

export default OpenDrive