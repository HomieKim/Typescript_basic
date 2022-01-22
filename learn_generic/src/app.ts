/* Generic */
// 제네틱 타입은 다른 타입과 연결되과 이때 연결된 타입이 정확히 어떤 타입인지 크게 상관이 없는 타입입니다.
// 배열은 그 자체로 Array타입이지만 안에 어떤 데이터 타입도 올 수 있음
// const arr : Array = []; 이코드는 에러남 js에서 Array는 하나의 타입이지만 정의 못한다 -> Array가 제네릭 타입이기 때문
const arr : any[] = []; // 이렇게 정의는 가능
//Array는 제네릭타입이기 때문에 안에 들어가는 타입을 명시하여 선언 가능
const names : Array<string> = ['Max', 'Homie'];


// promise도 제네릭 타입
// promise는 기본적으로 Promise<unknown> 제네릭을 명시해 줘서 반환 값을 다룰 수 있음
const promise : Promise<string> = new Promise((resolve, reject)=> {
    setTimeout(()=>{
        resolve('test');
    }, 2000);
});

promise.then(data => {
    data.length;
});

// array, promise 는 내장된 제네릭 타입, 제네릭 타입을 직접 만들어 사용가능

function merge<T extends object,U extends object>(objA : T, objB : U){
    return Object.assign(objA, objB);
}

const mergeObj = merge({name : 'homie'}, {age : 27}); 
// 제네릭 타입을 명시하지 않으면 리턴값은 그냥 object로 추정됨 내부 객체의 키로 접근 불가능
// 제네릭 타입을 사용함으로 merge된 객체의 내부 타입이 추론됨 그러면 내부에 접근 가능
// 위의 함수 같은 경우는 
/*
function merge<T,U>(objA : {name : string}, objB : {age : number}){
    return Object.assign(objA, objB);
}
이렇게 수정해줘도 되지만 타입이 추가 될 수도 있고 어떤 값이 들어올지 모른다면 제네릭 타입을 사용할 수 있음
*/
const mergeObj2 = merge({name : 'homiee',hobbies : ['sports', 'tennis']}, {age : 23});
console.log(mergeObj2);

// 제약조건 설정
// 위 merge 함수에서 제네릭통해 타입 추론하므로 어떤 타입이 와도 오류가 안나지만 return 시 Object.assign 해주려만 반드시 두 파라미터가 객체가 와야됨
// 따라선 제네릭 타입 <T, U>를 객체 타입으로 제한할 필요있음 => extends 키워드 사용


// interface로 타입을 커스텀해서 제네릭으로 사용할 수 있음
interface Lengthy {
    length : number;
}
function countAndDescribe<T extends Lengthy>(element : T) : [T,string]{
    let des = 'Got no value';
    if(element.length > 0 ){
        des = 'Got '+ element.length + ' elements';
    }
    return [element, des];
}

console.log(countAndDescribe('test'));


function extractAndConvert<T extends object, U extends keyof T>(obj: T , key: U){
    return obj[key];
}

extractAndConvert({a : 'homie'}, 'a');

/* generic class */

class DataStorage<T> {
    private data : T[] = [];

    addItem(item : T){
        this.data.push(item);
    }

    removeItem(item : T){
        this.data.splice(this.data.indexOf(item),1);
    }
    getItem(){
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('test');
textStorage.addItem('test2');
textStorage.removeItem('test');
console.log(textStorage.getItem());

const numberStorage = new DataStorage<number>();

// 객체로 dataStorage 사용시 문제 발생
const objStorage = new DataStorage<object>();

objStorage.addItem({name:'hommie'});
objStorage.addItem({name : 'max'});
objStorage.addItem({name:'lalal'});
objStorage.removeItem({name : 'hommie'}); // 객체 내용이 같아 보이지만 실제로는 새로운 주소에 할당되므로 위 로직에서 객체배열의 마지막 요소를 remove하고 있음
console.log(objStorage.getItem());

// 해결 : 객체를 변수에 할당해서 같은 주소를 가지게 하면 정상적으로 동작, 아니면 extens사용해서 DataStorage class를 원시타입 값만 사용하게 제한할 수 있음

// 제네릭을 사용하면 타입을 안전하게 제한하면서도 유연하게 사용이 가능합니다.


