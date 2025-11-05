//1)arthimetic operators (+(addition),-(subtraction),*(multiplication),**(exponential)
// ,/(division),%(modulus),++(increment),--(decrement))
//we know all about this
//just i will tell about increment and decrement
//if you write
let a=5
console.log(a++)
//here it will print again 5 but after we write
console.log(a)
//then it will print the value as 6 because here a++ means we printing the value of a after that
//we increement the value of a
//but if you write
console.log(++a)
//then it will print 6 because first we increement a value and then we print the value of a
//same for decreement also
//remaining all we know modulus means it tells remainder and exponential means x power y
//2)assignment operators
// +=  means x=x+y
// -=  means x=x-y
// /=  means x=x/y
// *=  means x=x*y
// %=  means x=x%y
// **= means x=x**y
//  =  means x=y
//we know about this operators also
//3)comparision operators
// ==  means   equal to   
// !=  means   not equal
// === means   equal to and type
// !== means   not equal value or not equal type 
// >   means   greater than
// <   means   less than
// >=  means   greater than or equal to
// <=  means   less than or equal to
// ?   means   ternary operator
//here i tell about ==,===,? remaining all you know
let b=2
let c="2"
//if you write
console.log(b==c)
//it prints true because it only checks value
//but if you write
console.log(b===c)
//it will print false because it also checks type also here b is number and c is string 
//i will explain ternary operator with an example
let age=19
let d=age>17?"you are eligible to vote":"you are not eligible to vote"
//here we write age=19 so it will print you are eligible to vote
//if you write
age=15
let e=age>17?"you are eligible to vote":"you are not eligible to vote"
//then it will print you are not eligible to vote
//like this the ternary operator will use
//4)logical operators
// || logical or
// && logical and
// !  logical not
//if you write two conditions and checking two conditions one condition is true and another
//condition is false 
//then if we use || operator it tells true because or operator tells if any one
//condition is true i will print true but in case of and operator it show false 
//because and operator tells if all conditions are true then only
//i will print true if any one of them is false then i will print false
// we already know about ! if condition is true it prints false and vice versa
//i will explain this logical operators concept clearly  in conditional statements(if-else)
//if you write        a   +   b
// here a,b are called as operands and + is called as operator
