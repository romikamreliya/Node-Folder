process.env.NODE_APP_ENV = "test";
const request = require("supertest");
const {app, server} = require('../app')

describe("GET /api/v1/user/get", () => {
  it("User Get", async () => {
    const res = await request(app).get("/api/v1/user/get");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: true,
      msg: "Success",
      data: {
        data: expect.arrayContaining([
            expect.objectContaining({ id: expect.any(Number) }),
        ]),
        pagination: expect.objectContaining({
            currentPage: 1,
            limit: 3,
            totalPages: 1,
            totalRows: 3,
        }),
      }
    });
  });
});


describe("POST /api/v1/user/ajv", () => {
  it("User AJV :- not pass payload", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });
  it("User AJV :- pass only name", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({name:"xyz"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });

  it("User AJV :- email pass = 'xyz'", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({name:"xyz",demoTemp:"wee",type:"sdsd", "email":"xyz", array:[], object:{}, email_two:"Sdsds"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });
  it("User AJV :- array pass []", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({name:"xyz",demoTemp:"wee",type:"sdsd", "email":"xyz@gmail.com", array:[], object:{}, email_two:"Sdsds@gmail.com"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });

  it("User AJV :- array pass [{},{}]", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({name:"xyz",demoTemp:"wee",type:"sdsd", "email":"xyz@gmail.com", array:[{email:"Sdsd@gmail.com", name:"sdsd"},{email:"Sdsd@gmail.com", name:"sdsd"}], object:{}, email_two:"Sdsds@gmail.com"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });

  it("User AJV :- array pass [{email:'Sdsd@gmail.com', name:'sdsd'},{email:'Sdsd@gmail.com', name:'sdsd'}]", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({name:"xyz",demoTemp:"wee",type:"sdsd", "email":"xyz@gmail.com", array:[{email:"Sdsd@gmail.com", name:"sdsd"},{email:"Sdsd@gmail.com", name:"sdsd"}], object:{}, email_two:"Sdsds@gmail.com"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });

  it("User AJV :- object pass {}", async () => {
    const res = await request(app).post("/api/v1/user/ajv").send({name:"xyz",demoTemp:"wee",type:"sdsd", "email":"xyz@gmail.com", array:[{email:"Sdsds@gmail.com", name:"sdsd"},{email:"Sdsd@gmail.com", name:"sdsd"}], object:{}, email_two:"Sdsds@gmail.com"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      res: false,
      msg: expect.any(String),
      data: []
    });
  });
});
