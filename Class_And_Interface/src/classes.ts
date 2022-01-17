class Department {
    /* 자바처럼 멤버 필드를 선언한 후 생성자로 초기화 할 수도 있지만 이중으로 반복되는 생성자 한번에 줄일 수 있습니다.
       생성자의 매개변수에 접근 지시자와 변수이 이름 타입을 선언해 줍니다. */
    //private id : string;
    //private name : string;
    private employees : string[] = [];
    // 초기화 이후 값이 변경되면 안되는 경우 readonly를 사용합니다.
    constructor(private readonly id : string, private name : string) {
        //this.id= id_;
        //this.name = n;
    }
    // static 메서드 나 필드는 인스턴스 생성 없이 클래스 이름으로 접근할 수 있습니다.
    // 단 static 메서드는 같은 클래스라도 static 키워드가 없으면 참조 할 수 없습니다. 클래스명으로 접근해야 합니다.

    static nowYear = 2022;
    static createDate(month : number, day:number) {
        return {
            year : this.nowYear,   // static 메서드는 this로 static 변수 참조 가능
            month : month,
            day : day
        };
    };
    describe(this : Department) {
        console.log('**describe**');
        console.log('name : ', this.name);
        console.log('ID : ', this.id);
        //console.log('nowYear : ' this.nowYear) static은 this로 접근 x
        console.log('nowYear : ', Department.nowYear); // 클래스명으로 접근
    };

    addEmployee(employee : string) {
        this.employees.push(employee);
    }

    printEmployeeInfo(){
        console.log('총 ',this.employees.length,'명');
        console.log(this.employees);
    }
}

// extends 키워드를 통해 원하는 클래스를 상속 받을 수 있습니다.
class ITDepartment extends Department {
    // 하위 클래스에서 고유의 생성자를 사용하지 않으면 부모의 생성자를 사용합니다.
    // 하위 클래스의 constructor는 super()를 통해 부모 생성자를 사용해야 합니다.
    constructor(id : string, private admins : string[]){
        super(id, 'IT');
    }
    printAdmins(){
        console.log('admins : ', this.admins);
    }

    addEmployee(name: string) {
        if(name === 'jennie'){
            return;
        }
        super.addEmployee(name);
    }
}

class AccountingDepartment extends Department {

    private lastreport : string;
    static instance : AccountingDepartment;
    get mostRecentReport() {
        if(this.lastreport){
            return this.lastreport;
        }
        throw new Error('no report found.');
    }

    set mostRecentReport(value : string){
        if(!value){
            return;
        }
        this.addReport(value);
    }

    private constructor(id:string, public reports : string[]){
        super(id, "Accounting");
        this.lastreport = reports[0];
    }

    static getInstance(){
        if(AccountingDepartment.instance){  // instance가 있다면 해당 instance를 그대로 리턴
            return this.instance; // static메서드는 static필드를 this로 접근가능
        }
        // instance가 없는경우 (최초생성) 생성자를 통해(private) 생성 후 리턴
        this.instance = new AccountingDepartment('Acc_ID', []);
        return this.instance;
    }

    addReport(text : string) {
        this.reports.push(text);
        this.lastreport = text;

    }

    printReports() {
        console.log('reports : ', this.reports);
    }
}

const IT = new ITDepartment('id_IT', ['max', 'homie']);
/* 싱글톤 패턴 */
// 싱글톤 패턴이란 클래스의 인스턴스를 하나로 제한하고 싶을 때 사용합니다. 예를 들어 AccountingDepartment가 오직 하나로만 운영된다고 가정할 때
// private 생성자를 사용하여 클래스 내부에서만 생성자를 생성하고 static메서드를 통해 instance를 리턴합니다.
//const accounting = new AccountingDepartment('My_Accounting',[]);
const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting, accounting2); // 두 인스턴스는 같은 인스턴스(싱글톤 패턴에 의해)


// console.log(accounting.mostRecentReport); setter에서 reports가 비었을 경우 throw new Error해줬음
console.log(accounting);
accounting.describe();
accounting.addEmployee('homie');
accounting.addEmployee('siri');
// accounting.employees[1] = 'zizi'; 접근 지시자를 통해 외부에서 class 내부의 필드에 접근할 수 없도록 해야합니다.`
accounting.printEmployeeInfo();
// this는 현재 객체를 참조하는 것이므로 단순히 함수 주소값면 복사했을 때 undefined나옴
// const accountingCopy = { name : 'copyName',describe : accounting.describe};
// accountingCopy.describe(); // undefined나옴, 타입스크립트에서는 이를 해결하기위해 this에 클래스 타입을 지정할 수 있음
console.log(IT);
accounting.addReport('sample report..');
accounting.printReports();
console.log('report[1]', accounting.reports[0]);
accounting.addReport('sample report no.2');
console.log('last report : ', accounting.mostRecentReport);
accounting.mostRecentReport = 'use setter report';


IT.addEmployee('jennie');
IT.addEmployee('MAX');
const dateObj = new Date();
const dateInfo = Department.createDate(dateObj.getMonth()+1, dateObj.getDate());
console.log('dateInfo : ', dateInfo);