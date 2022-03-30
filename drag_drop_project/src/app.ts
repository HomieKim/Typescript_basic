// Project Type
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateObj: Validatable) {
  console.log("dsfasdf", validateObj.value.toString().trim().length);

  if (
    validateObj.minLength != null &&
    typeof validateObj.value === "string" &&
    validateObj.value.length < validateObj.minLength
  ) {
    return true;
  }
  if (
    validateObj.maxLength != null &&
    typeof validateObj.value === "string" &&
    validateObj.value.length > validateObj.maxLength
  ) {
    return true;
  }
  if (
    validateObj.min != null &&
    typeof validateObj.value === "number" &&
    validateObj.value < validateObj.min
  ) {
    return true;
  }
  if (
    validateObj.max != null &&
    typeof validateObj.value === "number" &&
    validateObj.value > validateObj.max
  ) {
    return true;
  }
  if (validateObj.value.toString().trim().length === 0) {
    return true;
  }
  return false;
}
// Component Base 클래스
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  tmeplateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.tmeplateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.tmeplateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if(newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtStart){
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend'
      , this.element);
  }

  abstract configure(): void;
  abstract renderContent() : void;
}

// ProjectList 클래스
class ProjectList extends Component<HTMLDListElement, HTMLElement> {
 
  assignedProject: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", 'app', false, `${type}-projects`);
    this.templateElement = document.querySelector(
      "#project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.querySelector("#app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    this.assignedProject = [];
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProject = relevantProjects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProject) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// Project 입력 클래스
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.querySelector(
      "#project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.querySelector("#app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  // private submitHandler(e : Event) {
  //   e.preventDefault();
  //   console.log(this.titleInputElement.value);

  // }
  // 핸들러 함수를 일반 함수로 정의해서 사용하면 this 바인딩 문제가 생김 화살표 함수로 해도 되고 데코레이터 사용해서 해결 할 수 도 있다.
  private getUserInput(): [string, string, number] | void {
    const input_title = this.titleInputElement.value;
    const input_des = this.descriptionInputElement.value;
    const input_people = this.peopleInputElement.value;

    const validate_title: Validatable = {
      value: input_title,
      required: true,
    };
    const validate_des: Validatable = {
      value: input_des,
      required: true,
      minLength: 5,
      maxLength: 200,
    };
    const validate_people: Validatable = {
      value: +input_people,
      required: true,
      min: 1,
      max: 5,
    };

    if (validate(validate_title)) {
      alert("프로젝트 제목을 입력 해주세요");
    } else if (validate(validate_des)) {
      alert("프로젝트 설명은 5~200글자 사이로 입력해주세요");
    } else if (validate(validate_people)) {
      alert("프로젝트 인원은 1~5명으로 입력해주세요");
    } else {
      return [input_title, input_des, +input_people];
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private configure() {
    this.element.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      const userInput = this.getUserInput();
      if (Array.isArray(userInput)) {
        const [title, des, people] = userInput;
        console.log("title : ", title, "des : ", des, "people : ", people);
        projectState.addProject(title, des, people);
        this.clearInput();
      }
    });
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
