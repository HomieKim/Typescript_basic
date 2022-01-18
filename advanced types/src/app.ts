/* intersection type */
// 인터섹션 타입은 다른 타입과 결합이 가능하게 해줍니다.

type Admin = {
    name : string;
    privileges : string[];
};

type Employee = {
    name : string;
    startDate : Date;
}

// 두 타입을 결합 할 수 있습니다. interface로 같은 기능을 구현할 수 있습니다.
type ElevatedEmployee  = Admin & Employee;

const e1 : ElevatedEmployee = {
    name : 'homie',
    privileges : ['create-server'],
    startDate : new Date()
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

const uni : Universal = 1; // 유니온 타입을 결합하게 되면 공통으로 갖고있는 number 타입이 할당됨
// const uni : Universal = 'srt'; 

function add(a :Combinable , b: Combinable){
    // return a + b; 타입을 체크해야 리턴 가능합니다. 유니온 타입이기 때문에
    if(typeof a ==='string' || typeof b === 'string'){  // 이부분을 타입가드 라고 합니다.
        return a.toString() + b.toString();
    }
    return a+b;
};

type UnkownEmployee = Employee | Admin;

function printEmployee(emp : UnkownEmployee){
    console.log('Name : ', emp.name); // name은 공통이기 때문에 에러 안남
    // console.log('Privileges : ', emp.privileges); 어떤 타입인지 모르기 때문에 에러남
    // 타입가드 사용, Employee같은 내가 정의한 타입은 자바스크립트가 알지 못하기 때문에 typeof로 검사 x
   // if(typeof emp === 'Employee') 에러남
    if('privileges' in emp) {
        console.log('Privileges : ', emp.privileges);
    }
    if('startDate' in emp) {
        console.log('startDate : ', emp.startDate);
    }
}

printEmployee(e1);

// class의 경우 타입가드로 instanceof를 사용할 수 있습니다.

class Car {
    drive(){
        console.log('Driving...')
    }
};

class Truck{
    drive(){
        console.log('Driving a truck ...');
    }
    goTruck(amount : number){
        console.log(`go Truck ${amount}km`);
    }
};

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle : Vehicle){
    vehicle.drive(); // 공통이라서 가능
    // if('goTruck' in vehicle){
    //     vehicle.goTruck(1000)
    // } 이러케 타입 가드 가능
    // 클래스 기반일 경우 instanceof 사용가능
    if(vehicle instanceof Truck){
        vehicle.goTruck(1000)
    }
    
}

useVehicle(v1);
useVehicle(v2);

/* Discriminated Unions : 유니온 타입 사용시 타입가드의 구현을 용이하게 하는 기능입니다. */

interface Bird {
    check : 'bird';
    flyingSpeed : number;
}
interface Horse {
    check : 'horse';
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal : Animal){
    // if('runningSpeed' in animal) {
    //     console.log(animal.runningSpeed);
    // } 이 방식의 타입가드는 오타의 위험이 있고 type이 늘어날 때마다 로직을 추가해줘야 합니다.
    // 인터페이스에 리터럴 타입을 줘서 switch 사용가능
    let speed;
    switch(animal.check){
        case 'bird':
            speed = animal.flyingSpeed;
            break;
        case 'horse':
            speed = animal.runningSpeed;
            break;
    }
    console.log('Moving Speed : ', speed);
}

const instanceBird : Animal = {
    flyingSpeed : 100,
    check : 'bird',
}
const instanceHorse : Animal = {
    runningSpeed : 300,
    check : 'horse',
}

moveAnimal(instanceBird);
moveAnimal(instanceHorse);


/* type casting */
//const inputEl = <HTMLInputElement>document.querySelector('#user-input');
const inputEl = document.querySelector('#user-input')! as HTMLInputElement;

inputEl.value = 'Hi~ there'; // typescript가 htmlElement | null로 타입을 체크하고 있어서 input 인지 모름 
// value는 input타입인지 알아야함

/* index Type : 조금 더 유연하게 객체를 생성하게 돕는 타입입니다.*/

interface ErrorContainer {
    [prop : string] : string;
}
const errorBag : ErrorContainer = {
    email : 'Not a vaild eamil!!',
    useranem : 'Must start with a capptal cahracter'
}; // index 타입을 사용하면 해당 객체를 정의할 때 속성의 갯수를 미리 제한하지 않아도 됨

/* Nullish Coalescing */
const userInput =  undefined;
const storeData = userInput || 'DEFAULT'; // 값이 없으면 디폴트라 할당가능(null, undefined, 0 , '') 
// 빈문자열이나 0을 그대로 쓰고싶은경우 ?? 사용가능
const storeData2 = userInput ?? 'DEFAULT'; // null이랑 undefined 만 디폴트로 할당 됨
console.log(storeData2);