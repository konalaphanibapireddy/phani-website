//we use
console.log("hello world")
// to print our code in javascript
//we use let,var,const to declare values
//for example 
let a=45
let b="phani"
console.log(a,b)
//we can also use var in place of let 
//difference between var and let is 
//if you write 
var c =45;
{
    var c="navya"
    console.log(c)
}
console.log(c)
//if you run it give navya navya as result 
//but you write let in place of var then run it shows navya 45 means for that block only 
//c will execute as navya and in out side of block it will execute as 45 in case of let 
//in case of var if you change the value 45 to navya in that block but it executes after 
//that block also  so better use let in place of var every time its useful
//if you write 
/*const d=45
let d=56*/
//it shows error because if you decalare something with const it  never be changed 
//if you write 
//const d; it gives error so we must initailes with some value like this
const d=0
//let 4phani="harry" it will show error because you must write only vaiarbles after let 
//but you 4phani so it will show error
let phani18="harry" //it is valid but after let don't write number