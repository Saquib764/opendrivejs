
function make_string(data: [string] | undefined, val:string){
    data = data || [val]
    return data[0]
}
function make_double(data: [string] | undefined, val:number){
    if(data){
        val = parseFloat(data[0])
    }
    return val
}
function make_integer(data: [string] | undefined, val:number){
    if(data){
        val = parseInt(data[0])
    }
    return val
}
function make_boolean(data: [string] | undefined, val:boolean){
    if(data){
        val = data[0]=='true'?true: false
    }
    return val
}

export {
    make_string,
    make_double,
    make_integer,
    make_boolean
}
