import { v4 as uuidv4 } from "uuid";
import type { Project } from "../models/types";

export const demoProjects: Project[] = [
  {
    id: uuidv4(),
    name: "Todo App",
    description: "A simple todo list application built with Drafter",
    lastModified: new Date().toISOString(),
    pages: [
      {
        id: uuidv4(),
        name: "index",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        components: [
          { kind: "Header", id: uuidv4(), content: "My Todo List", level: 1 },
          {
            kind: "TextBox",
            id: uuidv4(),
            name: "new_task",
            defaultValue: "",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Add Task",
            routeId: "add_task",
          },
          {
            kind: "Text",
            id: uuidv4(),
            content: "Your tasks will appear below.",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "task_detail",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
        components: [
          {
            kind: "Header",
            id: uuidv4(),
            content: "Task Detail",
            level: 2,
          },
          {
            kind: "TextArea",
            id: uuidv4(),
            name: "task_notes",
            defaultValue: "",
          },
          {
            kind: "CheckBox",
            id: uuidv4(),
            name: "completed",
            defaultValue: false,
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Save",
            routeId: "save_task",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Back to List",
            routeId: "go_index",
          },
        ],
      },
    ],
    routes: [],
    stateModel: {
      primary: {
        name: "State",
        attributes: [
          {
            id: uuidv4(),
            name: "tasks",
            type: "list[str]",
            description: "List of task names",
          },
          {
            id: uuidv4(),
            name: "new_task",
            type: "str",
            description: "Input for new task",
          },
          {
            id: uuidv4(),
            name: "selected_task",
            type: "int",
            description: "Index of selected task",
          },
        ],
      },
      secondary: {
        name: "TaskDetail",
        attributes: [
          {
            id: uuidv4(),
            name: "task_notes",
            type: "str",
            description: "Notes for the task",
          },
          {
            id: uuidv4(),
            name: "completed",
            type: "bool",
            description: "Whether the task is done",
          },
        ],
      },
    },
    annotations: [
      {
        id: uuidv4(),
        type: "for",
        targetId: "",
        targetType: "page",
        description: "Loop over tasks to display each one",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Login Flow",
    description: "A user authentication flow with login and registration",
    lastModified: new Date().toISOString(),
    pages: [
      {
        id: uuidv4(),
        name: "index",
        backgroundColor: "#1a1a2e",
        fontFamily: "Georgia, serif",
        components: [
          {
            kind: "Header",
            id: uuidv4(),
            content: "Welcome to My App",
            level: 1,
          },
          {
            kind: "Text",
            id: uuidv4(),
            content: "Please log in or create an account.",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Login",
            routeId: "go_login",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Register",
            routeId: "go_register",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "login",
        backgroundColor: "#ffffff",
        fontFamily: "Georgia, serif",
        components: [
          { kind: "Header", id: uuidv4(), content: "Login", level: 2 },
          {
            kind: "TextBox",
            id: uuidv4(),
            name: "username",
            defaultValue: "",
          },
          {
            kind: "TextBox",
            id: uuidv4(),
            name: "password",
            defaultValue: "",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Submit",
            routeId: "do_login",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Back",
            routeId: "go_index",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "register",
        backgroundColor: "#ffffff",
        fontFamily: "Georgia, serif",
        components: [
          {
            kind: "Header",
            id: uuidv4(),
            content: "Create Account",
            level: 2,
          },
          {
            kind: "TextBox",
            id: uuidv4(),
            name: "new_username",
            defaultValue: "",
          },
          {
            kind: "TextBox",
            id: uuidv4(),
            name: "new_password",
            defaultValue: "",
          },
          {
            kind: "SelectBox",
            id: uuidv4(),
            name: "role",
            options: ["user", "admin", "moderator"],
            defaultValue: "user",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Register",
            routeId: "do_register",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "dashboard",
        backgroundColor: "#e8f4f8",
        fontFamily: "Georgia, serif",
        components: [
          {
            kind: "Header",
            id: uuidv4(),
            content: "Dashboard",
            level: 1,
          },
          {
            kind: "Text",
            id: uuidv4(),
            content: "You are logged in!",
          },
          {
            kind: "Button",
            id: uuidv4(),
            label: "Logout",
            routeId: "do_logout",
          },
        ],
      },
    ],
    routes: [],
    stateModel: {
      primary: {
        name: "State",
        attributes: [
          {
            id: uuidv4(),
            name: "username",
            type: "str",
            description: "Current username input",
          },
          {
            id: uuidv4(),
            name: "password",
            type: "str",
            description: "Current password input",
          },
          {
            id: uuidv4(),
            name: "logged_in",
            type: "bool",
            description: "Whether user is authenticated",
          },
        ],
      },
      secondary: {
        name: "RegistrationForm",
        attributes: [
          {
            id: uuidv4(),
            name: "new_username",
            type: "str",
            description: "New account username",
          },
          {
            id: uuidv4(),
            name: "new_password",
            type: "str",
            description: "New account password",
          },
          {
            id: uuidv4(),
            name: "role",
            type: "str",
            description: "User role selection",
          },
        ],
      },
    },
    annotations: [
      {
        id: uuidv4(),
        type: "if",
        targetId: "",
        targetType: "page",
        description: "If logged_in is True, show dashboard",
      },
      {
        id: uuidv4(),
        type: "state-change",
        targetId: "",
        targetType: "route",
        description: "Set logged_in = True on successful login",
      },
    ],
  },
];
