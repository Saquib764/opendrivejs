import * as Util from './util'

export default class Header {
	revMajor:		number		= 1
	revMinor: 		number		= 6
	name: 			string		= ''
	version: 		string
	date: 			string
	north: 			number
	south: 			number
	east: 			number
	west: 			number
	vendor?: 		string

	constructor(data:any) {
		this.revMajor	= Util.make_integer(data.revMajor, 1)
		this.revMinor 	= Util.make_integer(data.revMinor, 6)
		this.name     	= Util.make_string(data.name, '')
		this.version     	= Util.make_string(data.version, '')
		this.date     	= Util.make_string(data.date, '')
		this.north		= Util.make_double(data.north, 0)
		this.south		= Util.make_double(data.north, 0)
		this.east		= Util.make_double(data.north, 0)
		this.west		= Util.make_double(data.north, 0)
		this.vendor		= Util.make_string(data.vendor, '')
	}
}
