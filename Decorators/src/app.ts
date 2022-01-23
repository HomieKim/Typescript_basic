/* Decorator */
// 데코레이터는 함수입니다. 클래스 등에 특정한 방법으로 적용되는 함수
function Logger(log : string){
    console.log('Logger Decorator')
    return (constructor : Function) => {    // 데코레이터 함수를 반환하는 데코레이터 팩토리
        console.log(log);
        console.log(constructor);
    }
}

// function WithTemplate(template : string, hookId : string){
//     console.log('Template Decorator');
//     return (constructor : any) => {
//         const personInstance = new constructor();
//         const hookEl = document.getElementById(hookId);
//         if(hookEl){
//             hookEl.innerHTML = template;
//             hookEl.querySelector('h1')!.textContent = personInstance.name;
//         }
//     }
// }

// 데코레이터를 통해 클래스를 반환해서 생성자를 새로 대체하는 로직을 작성할 수 있습니다.
function WithTemplate(template : string, hookId : string){
    console.log('Template Decorator');
    return function<T extends {new (...args: any[]) : {name : string}}>(originalConstructor : T){
        return class extends originalConstructor {
            constructor(..._: any[]){
                super();
                console.log('Rendering Template');
                const hookEl = document.getElementById(hookId);
                if(hookEl){
                    hookEl.innerHTML = template;
                    hookEl.querySelector('h1')!.textContent = this.name;
                }
            }
        }
    };
}

// @라는 표현식 뒤에 함수를 명시해 줍니다. 데코레이터 함수에는 파라미터가 필요합니다.
// 클래스 데코레이터의 표현식은 데코레이팅된 클래스의 생성자를 유일한 인수로 런타임에 함수로 호출됩니다.
// 데코레이터는 클래스가 정의 될때 실행됩니다. 
// 클래스가 인스턴스화 될때 실행 되는 것이 아니기 때문에 데코레이터 함수가 먼저 실행되고 클래스를 인스턴스 화 하면 생성자 함수가 호출됩니다.
@Logger('LOG-PERSON')
@WithTemplate('<h1>My Document</h1>', 'divId')
class Person {
    name = 'Max';
    constructor() {
        console.log('createing person object...');
        
    }
}

// 데코레이터는 특정클래스에 기능을 더하는 함수라고 생각하면 됩니다.
// 데코레이터 팩토리는 단순히 데코레이터가 런타임에 호출할 표현식을 반환하는 함수입니다.


const pers = new Person();
console.log(pers);

// 하나이상의 데코레이터를 추가할 수 있습니다.
// 위에서 부터 팩토리가 실행되고 실제 데코레이터 함수는 아래서 부터 실행됨

// 클래스 속성에도 데코레이터 사용가능
function Log(target: any, propertyName : string | Symbol){
    console.log('Property decorator!!');
    console.log(target, propertyName);
}

// 접근제한제에도 데코레이터 사용가능, 파라미터 3개 가짐
function Log2(target: any, name : string, descriptor : PropertyDescriptor) {
    console.log('Accessor decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

// 함수에도 데코레이터 사용가능 , 파라미터는 접근 데코레이터랑 동일
function Log3(target:any,name : string | Symbol,descriptor : PropertyDescriptor ) {
    console.log('Method decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

// 파라미터에도 데코레이터 사용가능, 마지막 인자가 위치 나타냄
function Log4(target : any , name : string | Symbol, position : number){
    console.log('parameter decorator');
    console.log(target);
    console.log(name);
    console.log(position);
}

class Product {
    // 객체를 인스턴스화 할때 실행되는 것이 아니라 클래스를 정의할 때 실행됩니다.
    @Log    // 클래스의 속성에 데코레이터함수를 가질 수 있음, 이때 두가지 파라미터 설정해야됨, target은 생성될 객체의 포로토타입
    title : string;
    _price : number;

    @Log2
    set price(val : number) {
        if(val > 0){
            this._price = val;
        }else{
            throw new Error('Invalid price');
        }
    }
    constructor(t : string, p : number) {
        console.log('product class create!!!');
        this.title = t;
        this._price = p;
    }

    @Log3
    getPriceWithTax(@Log4 tax : number ){
        return this._price * (1+tax);
    }
}

const p1 = new Product('book' ,19);
const p2 = new Product('food', 33);

/*
중요 : 데코레이터는 함수 정의시 실행됩니다. 클래스의 생성자 처럼 인스턴스화 될 때 매번 실행되지 않습니다. 
즉, 데코레이터는 함수가 호출되거나 실행될 때 특정한 역할을 하지 않습니다. 클래스가 정의되면 그 순간 추가 설정 작업을 가능하게 합니다.
*/

function AutoBind(target : any, methodNmae : string, des : PropertyDescriptor) {
    // 여기서는 this키워드를 항상 메소드가 속한 객체에 설정해 둡니다.
    const origianlMethod = des.value; // 원래 메소드에 접근 가능합니다.
    const adjDescriptor : PropertyDescriptor = {
        configurable : true,
        enumerable : false,
        get() {
            const boundFn = origianlMethod.bind(this);
            return boundFn;
        }

    };
    return adjDescriptor;
}

class Printer {
    message = 'this works';

    @AutoBind
    showMessage() {
        console.log(this.message);
    }
}

const button = document.querySelector('button')!;
const printIns = new Printer();
button.addEventListener('click', printIns.showMessage); // 이벤트 리스너에서 this하면 event의 target을 가르키기 때문에 undfined .bind()해주면 해결 이를 데코레이터로 해결가능


/* validation */
interface ValidatorConfig {
    [property: string]: {
      [validatableProp: string]: string[]; // ['required', 'positive']
    };
  }
  
  const registeredValidators: ValidatorConfig = {};
  
  function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propName]: ['required']
    };
  }
  
  function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propName]: ['positive']
    };
  }
  
  function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
      return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
      for (const validator of objValidatorConfig[prop]) {
        switch (validator) {
          case 'required':
            isValid = isValid && !!obj[prop];
            break;
          case 'positive':
            isValid = isValid && obj[prop] > 0;
            break;
        }
      }
    }
    return isValid;
  }

class Course {
    @Required
    title : string;
    @PositiveNumber
    price : number;

    constructor(t : string ,p : number ){
        this.title = t;
        this.price= p;
    }
} 

const courseForm = document.querySelector('form');
courseForm?.addEventListener('submit', e => {
    e.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCource = new Course(title, price); // 보통 조건식을 통해 유효성검사를 합니다. ts에서 데코레이터에서 유효성 검사를 할 수 있습니다.
    if(!validate(createdCource)) {
        alert('!!!');
        return;
    }
    console.log(createdCource);

});