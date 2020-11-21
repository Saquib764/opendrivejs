
class PlanView{
	constructor(planView){
		this._planView = planView
		this.initialized = false
	}
	get geometry() {
		return this.parse_geometry(this._planView.geometry[0])
	}
	parse_geometry(geometry) {
		let s = parseFloat(geometry.s[0])
		let x = parseFloat(geometry.x[0])
		let y = parseFloat(geometry.y[0])
		let length = parseFloat(geometry.length[0])

		let line = null
		if (geometry.line) {
			line = new Line(geometry.line[0])
		}
		return {s, x, y, length, line}
	}
}

class Line {
	constructor(line){

	}
}

export default PlanView