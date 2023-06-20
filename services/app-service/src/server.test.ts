import supertest from 'supertest';
import express from 'express';
import { app } from './server';

app.use(express.urlencoded({ extended: false }));

it("index route works", done => {
    supertest(app)
      .get("/healthcheck")
      .expect(200, done);
  });