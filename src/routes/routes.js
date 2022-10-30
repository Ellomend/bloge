import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import("../pages/HomePage.vue"),
            children: [
                {
                    path: "/about",
                    name: "About",
                    component: () => import("../pages/AboutPage.vue"),
                },
                {
                    path: "/gitchart",
                    name: "GitChart",
                    component: () => import("../pages/GitChartPage.vue"),
                },
            ]
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("../pages/NotFoundPage.vue"),
        }
    ],
});


export default router;