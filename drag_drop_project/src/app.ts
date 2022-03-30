// Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(evnet: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

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
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
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
    this.updateListeners();
  }

  moveProject(projectId: string, newSattus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newSattus) {
      project.status = newSattus;
      this.updateListeners();
    }
  }

  private updateListeners() {
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
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}
// Project Item 클래스
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_: DragEvent): void {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener(
      "dragstart",
      this.dragStartHandler.bind(this)
    );
    this.element.addEventListener("dragend", this.dragEndHandler.bind(this));
  }
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
// ProjectList 클래스
class ProjectList
  extends Component<HTMLDListElement, HTMLElement>
  implements DragTarget
{
  assignedProject: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProject = [];

    this.configure();
    this.renderContent();
  }

  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
    this.element.addEventListener(
      "dragleave",
      this.dragLeaveHandler.bind(this)
    );
    this.element.addEventListener("drop", this.dropHandler.bind(this));
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
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProject) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}

// Project 입력 클래스
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
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

  renderContent() {}

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
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
