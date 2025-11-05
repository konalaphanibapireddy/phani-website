// i will tell switch condition with an example
let age=prompt("enter your age")
age=Number.parseInt(age)
switch(age){
    case 12:
        console.log("your age is 12")
        break
    case 16:
        console.log("your age is 16")
        break
    case 18:
        console.log("your age is 18")
        break
    case 20:
        console.log("your age is 20")
        break 
    default:
        console.log("your age is not specified")
}
//must write break after each case if you don't write it then all cases will execute
