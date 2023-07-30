module.exports.checkEmptyString = (value , helpers) =>{
    if(value.trim() === ''){
        return helpers.error("Value is empty");
    }

    return value;
}