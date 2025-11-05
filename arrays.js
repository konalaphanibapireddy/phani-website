let class_marks=[10,9,8,7]
// it is how we create an array to print this array we use
console.log(class_marks)
//if you write
console.log(class_marks[0])
//it will print 0th index means it prints 10
//if you write
console.log(class_marks.length)
//it prints how many indexs are there in that array means it prints 4
//if you write
console.log(typeof class_marks)
//it gives what type it is means it prints object because array is also an object
//if you write
delete class_marks[0]
//it will delete 0th index
//after that we replace 0th index value with another value like this 
class_marks[0]=11
//if you write
let array1=[1,2,3,4,5]
let array2=[11,12,13,14,15]
//here you want to store all values in one array
//then we write
let array=array1.concat(array2)
//if you print array it gives [1,2,3,4,5,11,12,13,14,15]
//if you have three arrays to concate we will write like this let array=array1.concat(array2,array3)
//if you write
let numbers=[1,55,777,897,44,6,7,908,345]
numbers.sort()
//it will print like this [1,345,44,55,6,7,777,897,908] it will print like alphabetical order
//means first it prints all 1 values than 2's than 3's than 4's observe result you will understand
//if you want to print array in ascending order we use functions concept for example
let compare=(a,b)=>{
    return a-b
}
let num=[1,23,56,45,67,86,90,1,2,34,65]
num.sort(compare)
console.log(num)
//it will print num array in ascending order to print in desecending order just write
//b-a in place of a-b
//to reverse an array we use array name.reverse()
