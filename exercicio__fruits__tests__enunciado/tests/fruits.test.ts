import app from "../src/index";
import supertest from "supertest";

const api = supertest(app);

describe("POST /fruits", () => {
    it("given a valid task it should return 201", async () => {
 
        const body = {
          name: 'Banana',
          price: 2,
        };

        const result = await supertest(app).post("/fruits").send(body);
        const status = result.status;
        
        expect(status).toEqual(201);
    });
  
    it("given an invalid task it should return 422", async () => {

        const body = {}; // corpo inválido
        const result = await supertest(app).post("/fruits").send(body);
        const status = result.status;
        expect(status).toEqual(422);

    });
  
    it("given a task with duplicate title it should return 409", async () => {
      
        const body = {
            title: 'morango',
            description: 3,
        };

        const firstTry = await supertest(app).post("/fruits").send(body);
        expect(firstTry.status).toEqual(201); // a primeira inserção vai funcionar

        // se tentarmos criar uma task igual, deve retornar 409
        const secondTry = await supertest(app).post("/tasks").send(body);
        expect(secondTry.status).toEqual(409);
    });
  });

describe('testando as frutas', () => {

    it('GET: /frutas expect return 200', async () => {

        const result = await api.get('/fruits');

        expect(result.status).toBe(200);

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        )
    });
});

describe('testando as frutas com id', () => {

    it('GET: /frutas/:id expect return 200', async () => {


        const result = await api.get('/fruits/1');
        expect(result.status).toBe(200);

        expect(result.body).toEqual(    
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
        )
    });

    it('GET: /frutas/:id expect return 404', async () => {


        const result = await api.get('/fruits/10');
        expect(result.status).toBe(404);

    });

    it('GET: /frutas/:id expect return 409 bad request not number', async () => {
        const result = await api.get('/fruits/banana');
        expect(result.status).toBe(409);

    });
});
