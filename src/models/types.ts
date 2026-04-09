export interface TextComponent {
  kind: "Text";
  id: string;
  content: string;
}
export interface TextBoxComponent {
  kind: "TextBox";
  id: string;
  name: string;
  defaultValue: string;
}
export interface TextAreaComponent {
  kind: "TextArea";
  id: string;
  name: string;
  defaultValue: string;
}
export interface CheckBoxComponent {
  kind: "CheckBox";
  id: string;
  name: string;
  defaultValue: boolean;
}
export interface SelectBoxComponent {
  kind: "SelectBox";
  id: string;
  name: string;
  options: string[];
  defaultValue: string;
}
export interface ButtonComponent {
  kind: "Button";
  id: string;
  label: string;
  routeId: string;
}
export interface HeaderComponent {
  kind: "Header";
  id: string;
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export type PageComponent =
  | TextComponent
  | TextBoxComponent
  | TextAreaComponent
  | CheckBoxComponent
  | SelectBoxComponent
  | ButtonComponent
  | HeaderComponent;

export interface Page {
  id: string;
  name: string;
  components: PageComponent[];
  backgroundColor: string;
  fontFamily: string;
}

export interface Route {
  id: string;
  fromPageId: string;
  toPageId: string;
  label: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface Dataclass {
  name: string;
  attributes: Attribute[];
}

export interface StateModel {
  primary: Dataclass;
  secondary: Dataclass;
}

export interface Annotation {
  id: string;
  type: "if" | "for" | "state-change";
  targetId: string;
  targetType: "page" | "route";
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  pages: Page[];
  routes: Route[];
  stateModel: StateModel;
  annotations: Annotation[];
}
