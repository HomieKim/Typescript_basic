/* 인터페이스 내용 */

// 인터페이스란 간단히는 객체가 어떤 모습인제 설명하는 역할을 합니다.
/*
인터페이스를 사용해서 객체의 타입 구조를 정의해서 타임체크를 할 수 있습니다.
인터페이스 왜 필요 한가? 커스텀 types랑 같은기능 아닌가?
interface 와 custom type은 차이점이 있습니다.

인터페이스는 객체의 구조를 설명하기 위해서만 사용될 수 있습니다.
커스텀 타입은 조금 더 유연하게 사용이 가능하지만
interface에 정의된 기능은 반드시 구현해야 합니다.
class에 implemnets를 추가하여 여러 인터페이스를 구현할 수 있습니다.
서로 다른 클래스간에 기능을 공유하기 위해 사용됩니다. 
*/
interface Named {
    readonly name : string;
    outputName?: string; // optional property 선택적으로 클래스가 값을 가지게 할 수 있습니다.
    /*
        참고
        ? : optional 말그대로 선택적으로 값을 가짐
        ! : 타입 체크시 null 또는 undefined가 들어오지 않을 것이라는 것을 알려주는 용도
        !! : 다른 타입의 데이터를 boolean 타입으로 명시적으로 형변환 하기위해 사용
    */
}

interface Greetable extends Named{
    //name : string = 'homie'; 인터페이스는 초기화 x
    // readonly name : string;
    greet(phrase : string) : void;
}

class Person implements Greetable {
    name  : string;
    age = 20;
    constructor(n : string) {
        this.name = n;
        
    }

    greet(text: string): void {
        console.log( text,' ', this.name);
        console.log('my age : ', this.age);
    }
    
}
let user1 : Greetable;
user1 = new Person('Homie');
// user1 = {
//     name : 'homie', // 객체 정의 할땐 ;아니라 ,로 구분
//     age : 25,
//     greet(text : string) {
//         console.log( text,' ', this.name);
//         console.log('my age : ', this.age);
//     },
// };

user1.greet('Hi~ My name is');
console.log(user1);

// 함수타입을 interface로 대체할 수 있습니다.
//type AddFn = (a :number , b: number) => number;
interface AddFn {
    (a:number, b:number) :number;
}
let add : AddFn;
add = (n1:number, n2: number) =>{
    return n1 + n2;
};
console.log(add(1,2));