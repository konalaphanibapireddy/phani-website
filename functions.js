//lets talk about functions in javascprit with an example
function avg(x,y){
    return (x+y)/2
}
let a=1
let b=2
let c=3
console.log(avg(a,b))
console.log(avg(b,c))
console.log(avg(a,c))
//it prints 1.5   ,  2.5   and   2
//to round off it means 1.5 as 2 and 2.5 as 3 we use math.round((x+y)/2) write after return
//in place of function we also use this
const average=()=>{
    return (p+q)/2
}
//if you write some object and you want to find the number of elements in that object 
//then we use length function for example
const item={
    "harry":true,
    "phani":false,
    "lovish":45,
    "rohan":undefined
}
console.log(item.length)
//it gives answer 4 because item object has 4 elements
//if you want to print all items in object then write
for (let i=0;i<item.length;i++) {
    console.log("the marks of "+ Object.keys(item)[i] + " are "+item(Object.keys(item)[i]))
}
// Object.keys(item)[i] it gives names and it item(Object.keys(item)[i]) gives values
//to print the name we write Object.keys(item)[i] this big code
//to avoid that we use for in loop
for(let i in item){
    console.log("the marks of "+ i +" are "+item[i])
}
//here i give name and item[i] gives value