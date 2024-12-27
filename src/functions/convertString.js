export const convertStringToArray = (str) => {
    let array = []
    if(str.length === 1){
        return array = array.push(str)
    }
    if(str.length === 0){
        return array
    }
    array = str.split(/\r?\n/)
    return array
}
export const convertStringToArrayObjects = (str) => {
    if(str.length === 0 ){
        const array = []
        return array
    }
    const convertArray = str.split(/\r?\n/)
    const convertToArrays = convertArray.map(item => item.split('-'))
    const convertToArrayObject = convertToArrays.map(item =>{
        return {
            left:item[0], right:item[1]
        }
    })
    return convertToArrayObject
}
export const covertArrayToString = (arr) => {
    if(arr?.length === 0) return
    let str = ''
    for(let i = 0; i < arr.length; i++){
        if(i === arr.length - 1){
            str += arr[i]
            return str
        }
        str += arr[i] + '\r\n' 
    }
    return str
}
export const convertArrayObjectsToString = (arr) => {
    const str = arr.length !== 0 && arr.map((item) => item.left+'-'+item.right).join('\r\n')
    return str
}