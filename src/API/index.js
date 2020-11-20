
const get_scenarios = () =>{
    return fetch('/data.json')
    .then(res=>res.json())
}

export default {
    get_scenarios
}