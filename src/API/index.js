
const get_opendrive_file = (name) =>{
    return fetch(`/opendrive/${name}.xodr`)
    .then(res=>res.text())
}

export default {
    get_opendrive_file
}