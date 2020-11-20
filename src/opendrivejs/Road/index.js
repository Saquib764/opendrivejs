import PlanView from './PlanView'
class Road{
	constructor(road){
		this.id = road.id[0]
		this.name = road.name[0]
		this.rule = road.rule[0]
		this.length = parseFloat(road.length[0])

		this.planView = new PlanView(road.planView[0])
	}
}

export default Road