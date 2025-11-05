//lets know about while loop
let n=prompt("enter a number")
n=Number.parseInt(n)
let i=0
/*while(i<n){
    console.log(i)
}*/
//if you enter any number  0 will print infinite times
//because if you enter 2 it checks i<n means first it checks 0<2 condition true
//so the loop will execute and again go to up again i=0 and n=2 again loop execute
//but if you write code like this
while(i<n){
    console.log(i)
    i++
}
//it will print 0 and 1 because first it checks 0<2 condition true it prints 0
//next we write i++ here so i value becomes 1 again condition checks 1<2 it is true
//so it prints 1 because now i value is 1 again i++
//again check condition 2<2 it is false so loop will close
//lets know about do while loop for example
let p=prompt("enter the value of n")
p=Number.parseInt(p)
let j=0
do{
    console.log(i)
    i++
} while(i<n)
    //execute it you will understand
    