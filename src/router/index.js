import { createRouter, createWebHistory } from "vue-router";
import Base from "../views/Base.vue";
import LoginPage from "../views/Login.vue";
import { useLoginStore } from "../stores/LoginStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/loginPage",
      component: LoginPage,
      name: "loginPage",
    },
    {
      path: "/base",
      component: Base,
      name: "base",
    },
    // Student Routes
    {
      path: "/base",
      component: Base,
      name: "studentHome",
      alias: "/studentHome",
    },
    {
      path: "/base",
      component: Base,
      name: "studentSettings",
      alias: "/studentSettings",
    },
    {
      path: "/base",
      component: Base,
      name: "studentRepertoire",
      alias: "/studentRepertoire",
    },
    {
      path: "/base",
      component: Base,
      name: "studentPerformances",
      alias: "/studentPerformances",
    },
    // Faculty Routes
    {
      path: "/base",
      component: Base,
      name: "facultyHome",
      alias: "/facultyHome",
    },
    {
      path: "/base",
      component: Base,
      name: "facultyPieces",
      alias: "/facultyPieces",
    },
    {
      path: "/base",
      component: Base,
      name: "facultyStudents",
      alias: "/facultyStudents",
    },
    // Accompanist Routes
    {
      path: "/base",
      component: Base,
      name: "accompanistHome",
      alias: "/accompanistHome",
    },
    {
      path: "/base",
      component: Base,
      name: "accompanistPieces",
      alias: "/accompanistPieces",
    },
    {
      path: "/base",
      component: Base,
      name: "accompanistStudents",
      alias: "/accompanistStudents",
    },
    // Admin Routes
    {
      path: "/base",
      component: Base,
      name: "adminHome",
      alias: "/adminHome",
    },
    {
      path: "/base",
      component: Base,
      name: "adminInstruments",
      alias: "/adminInstruments",
    },
    {
      path: "/base",
      component: Base,
      name: "adminEvents",
      alias: "/adminEvents",
    },
    {
      path: "/base",
      component: Base,
      name: "adminUsers",
      alias: "/adminUsers",
    },
    {
      path: "/base",
      component: Base,
      name: "adminComposers",
      alias: "/adminComposers",
    },
    {
      path: "/base",
      component: Base,
      name: "adminPieces",
      alias: "/adminPieces",
    },
    {
      path: "/base",
      component: Base,
      name: "adminEvaluations",
      alias: "/adminEvaluations",
    },
    {
      path: "/base",
      component: Base,
      name: "adminMajors",
      alias: "/adminMajors",
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
