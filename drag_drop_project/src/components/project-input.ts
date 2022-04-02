import { projectState } from '../state/project-state';
import { Validatable, validate } from '../utils/validation';
import { Component } from './base-componet';

// Project 입력 클래스
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
