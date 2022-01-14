enum Role { 
    ADMIN = 0,
    USER = 1,
    ATHOR = 2,
}

const person = {
    name : 'homie',
    age : 27,
    hobbies : ['sports', 'cooking'],
    // 튜플 타입  [a,b] == 두개의 인자만 사용함, enum이랑 비슷
    role : Role.ADMIN
};
let Activities : string[]= [...person.hobbies];
Activities[1] = 'hiking'
console.log(person.name);
console.log(person.hobbies);
console.log(Activities);

switch(person.role){
    case 0:
        console.log("i'm ADMIN");
        break;
    case 1:
        console.log("i'm USER");
        break
    case 2:
        console.log("i'n AHTOR");  
        break;  
}

/*
object type : key-value 쌍이 아니라 key-type으로 이루어진 object
const person : {
    name : string,
    age : number,
    hobbies : string[]
} = {
    name : 'homie',
    age : 27,
    hobbies : ['sports', 'cooking']
};
*/