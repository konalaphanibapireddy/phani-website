let a=14
let b=80
if(a>10 && b>90){
    console.log(hi)
}
else{
    console.log(hello)
}
//it prints hello because a>10 is true but b>90 is false
//in and operator both must be true or must be false then only it will print
let c=14
let d=80
if(a>10 || b>90){
    console.log(hi)
}
else{
    console.log(hello)
}
//it prints hi becase in that two conditions one is true i.e., c>10 so it will print
// if two statements are give we use if,else but for more than 2 we use else if
//for example
let e=prompt("enter a number:")
e=Number.parseInt(e)
if(e==7){
    console.log("thala for reason")
}
else if(e==18){
    console.log("ee sala cup namde")
}
else if(e==1){
    console.log("i am number 1")
}
else {
    console.log("mg")
}
//like this we write
