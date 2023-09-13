import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => {
  server.listen();
});

beforeEach(() => {});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
