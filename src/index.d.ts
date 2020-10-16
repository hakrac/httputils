import ApplicationRequest from "./request";
import ApplicationResponse from "./response";
import Application from "./server";

declare function createApplication(Request: ApplicationRequest, Response: ApplicationResponse, wsMultiplexing: boolean): Application

export = createApplication