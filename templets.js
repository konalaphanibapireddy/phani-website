//lets us some example
let boy1="phani"
let boy2="harsha"
//we want to boy2 friend of boy1 using templets
let sentence=`boy2 is freind of boy1`
// here`` this is back tick it is in before 1 in keyboard
console.log(sentence)
//then it will print boy2 is freind of boy1
//if want to print names in place of boy1,boy2 then
let line=`${boy2} is freind of ${boy1}`
//it will print harsha is freind of phani
//if you write 
//let name='phani's'
//it will give error
//to phani's in '' we use \
let name1='phani\'s'
//if you write 
//let name="phani"s"
//it will give error
//to phani"s in "" we use \
let name2="phani\"s"
//if you write
let name="phani\nbapi"
//it will print phani in one line and bapi another line
//we use \r(carriage return) in place of \n also

