import express from 'express';
import * as controllers from './controllers';

export const endpoints = (router: express.Router) => {
    router.get("/", controllers.test);
    router.get("/tasks", controllers.tasks);
}