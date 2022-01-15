
/* let, const */
let userName = "sample";
userName = "variable"
const pw = 1234;
// pw = 321 const 는 변할수 없습니다.

// var 와 let의 가장 큰 차이는 let 과 const 는 블록 스코프라는 개념을 사용합니다..
// var는 전역적으로 참조 가능합니다.

function  sample() {
    var isTrue = true;
}
// console.log(isTrue); function의 경우 var 사용 블가 

if(true){
    //var isFalse = false; 콘솔에 찍힘
    let isFalse = false; // 블록 스코프기 때문에 에러 뜸
}

//console.log(isFalse);


/* Arrow Function */
const add = (a: number, b: number) =>  a+ b;    // 바로 return 하는 경우 중괄호 return 생략가능

console.log(add(1,4));

// 파라미터가 하나 밖에 없을 경우 괄호 생략가능. 근데 타입 지정 불가능 그래서 변수에다 타입 지정해서 씀
const printOut :(a : number | string)=>void  = output  => console.log(output);
console.log(add(4,5));
console.log("9");


/* spread oprerator */

const hobbies = ['Sports', 'Cooking','remain','remain2'];
const activeHobbies = ['Hiking'];

// activeHobbies.push(hobboies); 에러남 타입추론시 string[]이 되기 때문에 string 만 푸쉬 할 수 있음
activeHobbies.push(...hobbies);
console.log("activeHobbies : ",activeHobbies);
console.log("hobbies : ",hobbies);

const person = {
    name_ : 'homie',
    age: 27
};

const copyPerson = {...person, age: 13};
copyPerson['name_'] = "siri";    // 복사한 객체의 내부 값을 바꾸면 원본 값도 바뀜, 객체의 주소값을 참조 하고 있기 때문에
//copyPerson.hobby = "sports";
console.log("person : ", person );
console.log("copyPerson : ", copyPerson );

/* rest paprmeters */

const addNums = (...numbers : number[]) => {
    return numbers.reduce((curResult, curValue) => {
        return curResult + curValue;
    });
};

const oneToten = addNums(1,2,3,4,5,6,7,8,9,10);
console.log(oneToten);

/* deconstructor */
const [hobby1, hobby2, ...remainHobbies] = hobbies;

console.log(hobby1, hobby2 , remainHobbies);

const { name_ : username, age: userage} = person;
console.log(username, userage);


