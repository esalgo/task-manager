import { loginView } from '../pages/login/login-view.js'
import { registerView } from '../pages/register/register-view.js'
import { homeView } from '../pages/home/home-view.js'
import { taskView } from '../pages/tasks/task-view.js'
import {logoutView} from "../pages/logout/logout-view.js";
import {usersView} from "../pages/users/users-view.js";
import {profileView} from "../pages/profile/profile-view.js";
import {statisticsView} from "../pages/statistics/statistics-view.js";

export let routes = {
    "/login" : loginView,
    "/register" : registerView
}

export let usersRoutes = {
    "/home" : homeView,
    "/tasks" : taskView,
    "/profile" : profileView,
    "/logout" : logoutView
}

const {"/profile": profileRoute, ...sharedRoutes} = usersRoutes

export let adminRoutes = {
    ...sharedRoutes,
    "/statistics": statisticsView,
    "/users": usersView
}

export let routesWithTables = ["/users", "/tasks"]
