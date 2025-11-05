//lets talk about splice function
//to insert and delete the item in array we use splice function 
//i will explain it with example
//let num=[1,2,3,4,5,6,7,8,9]
//num.splice(2,4,1022,1023,1024,1025,1026)
//console.log(num)
//here 2 is the index position that we want to intersect and 4 is the numbers values we want to
//delete after and including 2 remaining all are the values we want to intersect
//so the final result of the above code is [1,2,1022,1023,1024,10256,1026,7,8,9]
//if you want to print deleted item in above array just write
//let deletedvalues=num.splice(2,4,1022,1023,1024,1025,1026)
//console.log(deletedvalues)
//it will print[3,4,5,6]
//let talk about slice function it cut main array in to sub array
//for example
let num=[551,22,3,14,5,6,7,8,229]
//let newnum=num.slice(3)
//console.log(newnum)
//then it gives answer [14,5,6,7,8,299]
//if you write 
let newnum=num.slice(3,6)
console.log(newnum)

