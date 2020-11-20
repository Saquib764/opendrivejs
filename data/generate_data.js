'use strict';

const fs = require('fs');
var uniqid = require('uniqid');
const CAR_MODEL = ['VOLVO XC', 'TESLA C', 'MINI COOPER', 'TATA', 'TATA NANO', 'KIA ABC']
const OUTPUT_FILE = `${__dirname}/../public/data.json`


const sample_from_range = (range=[0,1]) => {
    return range[0] + Math.floor(Math.random()*(range[1] - range[0]))
}

const generate_scenarios = (n=5, maxNumberOfStops=[4, 10], maxRunningTime=[10, 20])=>{
    /* Generate scenario.
     * Input:
     *      n: number of scenario samples
     *      maxNumberOfStops: Range for max number of stops
     *      maxRunningTime: Range for max running time in seconds
     *
     * Output: List of scenarios 
     */ 

    let scenarios = []
    for(let i=0; i < n; i++) {
        scenarios.push({
            scenarioId: uniqid(),
            maxNumberOfStops: sample_from_range(maxNumberOfStops),
            maxRunningTime: sample_from_range(maxRunningTime),
        })
    }
    return scenarios
}
const generate_simulation_runs = (scenario, n=5, chances = [0.1, 0.2, 0.2])=>{
    /* Generate simulation run for a given scenario.
     * Input:
     *      scenario: scenario object
     *      n: number of samples
     *      chances: probability of [collision, failure due to numberOfStops, failure due to runningTime]
     *
     * Output: List of simulation runs 
     */ 

    let simulations = []
    for(let i=0; i < n; i++) {
        let hasCollision = Math.random() < chances[0];
        let numberOfStops = Math.random() < chances[1]?sample_from_range([scenario.maxNumberOfStops + 1, scenario.maxNumberOfStops + 6]):
                                                    sample_from_range([0, scenario.maxNumberOfStops])
        let runningTime = Math.random() < chances[2]?sample_from_range([scenario.maxRunningTime + 1, scenario.maxRunningTime + 6]):
                                                    sample_from_range([scenario.maxRunningTime*0.5 , scenario.maxRunningTime])
        
        let startTime = Date.now() - sample_from_range([0, 10])*3600*1000
        simulations.push({
            startTime,
            endTime: startTime + runningTime*1000,
            scenarioId: scenario.scenarioId,
            carBuild: CAR_MODEL[sample_from_range([0, CAR_MODEL.length])],
            result: {
                numberOfStops,
                hasCollision
            }
        })
    }
    return simulations
}

const generate_random_simulation_data = (NUM_SCENARIO=5, NUM_SIMULATION=10) => {
    let scenarios = generate_scenarios(NUM_SCENARIO)
    let simulationRuns = scenarios.reduce((sim, scenario)=> [...sim, ...generate_simulation_runs(scenario, NUM_SIMULATION)], [])

    return {simulationRuns, scenarios}
}

let data = generate_random_simulation_data(5, 10);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data));