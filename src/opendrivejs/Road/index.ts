import * as Util from '../util'
import PlanView from './PlanView'
const delta_s = 0.2

let COLOR = ['', 'green', 'red', 'gray']
// This will remove gradual lane curves, For debugging
const showRectangleLane = false

interface Lanes{
    laneSection: [LaneSection],
    laneOffset?: [LaneOffset]
}
interface LeftRightCenterLaneSection{
    // lane
}

export default class Road{
	id: 			string
	name: 			string
	rule:			string 		= 'RHT'
	length: 		number
    planView: 		PlanView
    lanes:          Lanes
    initialized:    boolean     = false

	constructor(data:any) {
		this.id     	= Util.make_string(data.id, '')
		this.name     	= Util.make_string(data.name, '')
		this.rule     	= Util.make_string(data.rule, this.rule)
		this.length		= Util.make_double(data.length, 1)
        this.planView   = new PlanView(data.planView[0])
        this.lanes      = {
            laneSection: data.lanes[0].laneSection.map((ls:any)=> new LaneSection(ls))
        }
        this.lanes.laneSection.sort((a, b)=> b.s - a.s)
        let currentEnd = this.length
        for(let i=0; i < this.lanes.laneSection.length; i++){
            this.lanes.laneSection[i].length = currentEnd - this.lanes.laneSection[i].s
            currentEnd = this.lanes.laneSection[i].s
        }
	}
	render(THREE:any, scene:any){
        if(this.initialized)    return
        this.lanes.laneSection.map((ls:LaneSection)=> ls.render(THREE, scene))
        this.planView.render(THREE, scene)
        this.initialized = true
	}
}

class Width {
    sOffset:        number
    a:              number
    b:              number
    c:              number
    d:              number
    constructor(data:any) {
		this.sOffset		= Util.make_double(data.sOffset, 0)
		this.a		= Util.make_double(data.a, 0)
		this.b		= Util.make_double(data.b, 0)
		this.c		= Util.make_double(data.c, 0)
		this.d		= Util.make_double(data.d, 0)
    }
    get_value(ds:number) {
        let {a, b, c, d} = this
        return a + b*ds + c*ds*ds + d*ds**3
    }
}


class Lane {
    id:             number
    type:           string
    level:          boolean=false
    roadMark:       [RoadMark]|undefined

    _length:        number  = 0

    _parentSection: LaneSection|undefined
    get length() {
        return this._length
    }
    set length(length: number) {
        this._length = length
    }
    _start:         number  = 0
    get start() {
        return this._start
    }
    set start(start: number) {
        this._start = start
    }

    constructor(data:any) {
		this.id     	= Util.make_integer(data.id, 0)
		this.type     	= Util.make_string(data.type, '') 
        this.level      = Util.make_boolean(data.level, this.level)
        if(data.roadMark) {
            this.roadMark   = data.roadMark.map((rm:any)=> new RoadMark(rm))
        }
    }
    render(THREE:any, scene:any) {
    }
}

class LaneLR extends Lane {
    width:          Width

    _idOffset:        number  = 0
    get idOffset() {
        return this._idOffset
    }
    set idOffset(offset: number) {
        this._idOffset = offset
    }
    constructor(data:any) {
        super(data)
        this.width      = new Width(data.width[0])
    }
    render(THREE:any, scene:any) {
        let _delta_s = delta_s
        let ds = 0.0
        let i = 0
        let dir = this.id/Math.abs(this.id)

        let laneColor = Util.get_lane_color(this.type)
        if(!showRectangleLane){
            while(i<1000 && ds < this.length){
                i++
                let startWidth = this.width.get_value(ds)
                ds += _delta_s
                let endWidth = this.width.get_value(ds)
                if(startWidth==0.0 && endWidth == 0.0){
                    continue
                }
                let idOffset = this._parentSection!.get_lane_offset_due_to_id(this.id, ds)
                // console.log(idOffset)
                const geometry = new THREE.PlaneGeometry( _delta_s, startWidth );

                geometry.translate(this.start + ds + _delta_s/2, dir*(idOffset + (startWidth+endWidth)/4), 0)
                const material = new THREE.MeshBasicMaterial( {color: laneColor, side: THREE.DoubleSide} );
                const plane = new THREE.Mesh( geometry, material );

                scene.add(plane)
            }
            return
        }

        let laneWidth = this.width.get_value(0) + .001
        const geometry = new THREE.PlaneGeometry( this.length, laneWidth );
        geometry.translate(this.start + this.length/2, dir*(this.idOffset + laneWidth/2), 0)
        const material = new THREE.MeshBasicMaterial( {color: COLOR[Math.abs(this.id)], side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );

        scene.add(plane)
    }
}

class LaneSection {
    s:              number
    singleSide:     boolean = true
    center                  = {lane: [Lane]}
    left:           {lane: [LaneLR]}|undefined
    right:          {lane: [LaneLR]}|undefined
    initialized:    boolean = false

    _length:        number  = 0
    get length() {
        return this._length
    }
    set length(length: number) {
        if(this.left) {
            this.left.lane.map((l) => l.length = length)
        }
        if(this.right) {
            this.right.lane.map((l) => l.length = length)
        }
        this._length = length
    }
    get_lane_offset_due_to_id(id:number, ds:number){
        let offset = 0.0
        if(id>0 && this!.left){
            for(let i=1; i<id; i++) {
                let l = this!.left!.lane.find(l=> l.id==i)
                offset += l!.width.get_value(ds)
            }
        }
        if(id<0 && this!.right){
            for(let i=-1; i>id; i--) {
                let l = this!.right!.lane.find(l=> l.id==i)
                offset += l!.width.get_value(ds)
            }
        }
        return offset
    }

    constructor(data:any) {
        this.s              = Util.make_double(data.s, 0)
        this.center.lane    = data.center[0].lane.map((l:any)=>new Lane(l))
        if(data.left) {
            this.left       = { lane: data.left[0].lane.map((l:any)=>new LaneLR(l)) }
            this.left.lane.sort((a, b) => a.id - b.id)
            this.left.lane.forEach((l) => {
                l.start = this.s
                l._parentSection = this
            })
            for(let i=1; i<this.left.lane.length; i++) {
                this.left.lane[i].idOffset = this.left.lane[i-1].width.get_value(0) + this.left.lane[i-1].idOffset
            }
        }
        if(data.right) {
            this.right       = { lane: data.right[0].lane.map((l:any)=>new LaneLR(l)) }
            this.right.lane.sort((a, b) => b.id - a.id)
            this.right.lane.forEach((l) => {
                l.start = this.s
                l._parentSection = this
            })
            for(let i=1; i<this.right.lane.length; i++) {
                this.right.lane[i].idOffset = this.right.lane[i-1].width.get_value(0) + this.right.lane[i-1].idOffset
            }
        }
    }
    render(THREE:any, scene:any) {

		if(this.initialized) return
        if(this.left){
            this.left.lane.map(l=> l.render(THREE, scene))
        }
        if(this.right){
            this.right.lane.map(l=> l.render(THREE, scene))
        }
        this.initialized = true
    }
}

class RoadMark {
    sOffset:            number
    weight:             string  = ''
    constructor(data:any) {
        this.sOffset       = Util.make_double(data.sOffset, 0)
        this.weight       = Util.make_string(data.weight, this.weight)
    }
}

class LaneOffset {
    constructor() {
        
    }
}