import ApplicationRequest from "./request";
import ApplicationResponse from "./response";
import Application from "./server";

declare function createApplication(Request: typeof ApplicationRequest, Response: typeof ApplicationResponse, multipexingOptions: any): Application

export = createApplication