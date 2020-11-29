/*

The attributes with `True` tags are supported completely

OpenScenario:
header 					type 		unit 		value 		is_supported?
	- revMajor: 		ushort	: 			: 	1		: 	True
	- revMinor: 		ushort	: 			: 	6
	- name: 			string
	- version: 			string
	- date: 			string
	- north: 			double	: 	m 		: 	
	- south: 			double	: 	m
	- east: 			double 	: 	m
	- west: 			double 	: 	m
	- vendor: 			string

road[1+]
	- name[optional]:	string
	- length: 			>0
	- id: 				string
	- junction: 		string
	- rule[optional]: 	e_trafficRule
	- planView[mandatory]
		- geometry[1+]
			- s: 		>=0
			- x: 		double
			- y: 		double
			- hdg: 		double
			- length: 	>0
			- type: line/spiral/arc/poly3/paramPoly3
			[depending on type, following. not available if line]
			- spiral
				- curvStart: 		double
				- curvEnd: 			double
			- arc
				- curvature
			-poly3
				- a: 				double
				- b: 				double
				- c: 				double
				- d: 				double
			-poly3
				- aU: 				double
				- bU: 				double
				- cU: 				double
				- dU: 				double
				- aV: 				double
				- bV: 				double
				- cV: 				double
				- dV: 				double
				- pRange: 			eParamPoly3_range
	- lanes[mandatory]
		- laneSection[1+]
			- s: 							>=0
			- singleSide[optional]: 		boolean
			- center
				- lane[1+]
					- id 					0
					- type 					e_laneType
					- roadMark[0+]
						- 
			- left[optional]
				- lane[1+]
					- id 					+veInt
					- lr_lane: same as lane in <right /> 
			- right[optional]
				- lane[1+]
					- id 					-veInt
					- lr_lane
		- laneOffset[0+]
			- s: 				>=0
			- a: 				double
			- b: 				double
			- c: 				double
			- d: 				double
	- link[optional]
		- predecessor[0+] structure same as successor
		- successor[0+]
			- elementId: 					string
			- elementType: 					e_road_link_elementType
			- contactPoint[optional]: 		e_contactPoint
			- elementS[optional]: 			>=0
			- elementDir[optional]: 		e_elementDir
	- objects[optional]
		-
	- signals[optional]
		- 
	- railroad[optional]
		- type[0+]
		- s: 			>=0
		- type: 		e_roadType
		- countryCode[optional]
		- speed[optional]
			- max: 							t_maxSpeed
			- unit: 						e_unitSpeed
	- lateraProfile[optional]
		- superelevation[0+]
			-
		- shape[0+]
		- 
	- levationProfile[optional]
		- elavation[0+]
			-
	- surface[optional]
		- CRG[0+]
			-

controller[0+]
	- 

junction[0+]
	- 

junctionGroup[0+]
	-

station[0+]
	-

*/
