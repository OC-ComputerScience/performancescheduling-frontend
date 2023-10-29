import { createRouter, createWebHistory } from "vue-router";
import BaseView from "../views/BaseView.vue";
import LoginView from "../views/LoginView.vue";
import { useLoginStore } from "../stores/LoginStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      component: LoginView,
      name: "loginPage",
    },
    {
      path: "/base",
      component: BaseView,
      name: "base",
    },
    {
      path: "/base",
      component: BaseView,
      name: "userSettings",
      alias: "/userSettings",
    },
    // Student Routes
    {
      path: "/base",
      component: BaseView,
      name: "studentHome",
      alias: "/studentHome",
    },
    {
      path: "/base",
      component: BaseView,
      name: "studentRepertoire",
      alias: "/studentRepertoire",
    },
    {
      path: "/base",
      component: BaseView,
      name: "studentInstruments",
      alias: "/studentInstruments",
    },
    {
      path: "/base",
      component: BaseView,
      name: "studentPerformances",
      alias: "/studentPerformances",
    },
    // Faculty Routes
    {
      path: "/base",
      component: BaseView,
      name: "facultyHome",
      alias: "/facultyHome",
    },
    {
      path: "/base",
      component: BaseView,
      name: "facultyPieces",
      alias: "/facultyPieces",
    },
    {
      path: "/base",
      component: BaseView,
      name: "facultyStudents",
      alias: "/facultyStudents",
    },
    {
      path: "/base",
      component: BaseView,
      name: "facultyPerformances",
      alias: "/facultyPerformances",
    },
    {
      path: "/base",
      component: BaseView,
      name: "facultyCreateCritique",
      alias: "/facultyCreateCritique",
    },
    // Accompanist Routes
    {
      path: "/base",
      component: BaseView,
      name: "accompanistHome",
      alias: "/accompanistHome",
    },
    {
      path: "/base",
      component: BaseView,
      name: "accompanistPieces",
      alias: "/accompanistPieces",
    },
    {
      path: "/base",
      component: BaseView,
      name: "accompanistStudents",
      alias: "/accompanistStudents",
    },
    // Admin Routes
    {
      path: "/base",
      component: BaseView,
      name: "adminHome",
      alias: "/adminHome",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminInstruments",
      alias: "/adminInstruments",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminEvents",
      alias: "/adminEvents",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminEventTypes",
      alias: "/adminEventTypes",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminUsers",
      alias: "/adminUsers",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminComposers",
      alias: "/adminComposers",
      props: (route) => ({ query: route.query.q }),
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminPieces",
      alias: "/adminPieces",
      props: (route) => ({ query: route.query.q }),
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminEvaluations",
      alias: "/adminEvaluations",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminMajors",
      alias: "/adminMajors",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminLevels",
      alias: "/adminLevels",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminSemesters",
      alias: "/adminSemesters",
    },
    {
      path: "/base",
      component: BaseView,
      name: "adminLocations",
      alias: "/adminLocations",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/"];
  const loginStore = useLoginStore();
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = loginStore.user;
  if (authRequired && !loggedIn) {
    return next("/");
  }
  next();
});

export default router;
