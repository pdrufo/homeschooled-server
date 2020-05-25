const knex = require("knex");
const app = require("../src/app");
const {
  makeSchoolLogArray,
  makeMaliciousSchoolLog,
} = require("./school.fixtures");

describe("SchoolLog Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("school").truncate());

  afterEach("cleanup", () => db("school").truncate());

  describe(`GET /api/school-logs`, () => {
    context(`Given no schoolLogs`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/school-logs").expect(200, []);
      });
    });

    context("Given there are schoolLogs in the database", () => {
      const testSchoolLog = makeSchoolLogArray();

      beforeEach("insert schoolLog", () => {
        return db.into("school").insert(testSchoolLog);
      });

      it("responds with 200 and all of the schoolLogs", () => {
        return supertest(app)
          .get("/api/school-logs")
          .expect(200, testSchoolLog);
      });
    });

    context(`Given an XSS attack schoolLog`, () => {
      const {
        maliciousSchoolLog,
        expectedSchoolLog,
      } = makeMaliciousSchoolLog();

      beforeEach("insert malicious schoolLog", () => {
        return db.into("school").insert([maliciousSchoolLog]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/school-logs`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].student).to.eql(expectedSchoolLog.student);
            expect(res.body[0].english).to.eql(expectedSchoolLog.english);
          });
      });
    });
  });

  describe(`GET /api/school-logs/:id`, () => {
    context(`Given no schoolLogs`, () => {
      it(`responds with 404`, () => {
        const schoolLogId = 123456;
        return supertest(app)
          .get(`/api/school-logs/${schoolLogId}`)
          .expect(404, { error: { message: `SchoolLog doesn't exist` } });
      });
    });

    context("Given there are schoolLogs in the database", () => {
      const testSchoolLog = makeSchoolLogArray();

      beforeEach("insert schoolLogs", () => {
        return db.into("school").insert(testSchoolLog);
      });

      it("responds with 200 and the specified schoolLog", () => {
        const schoolLogId = 2;
        const expectedSchoolLog = testSchoolLog[schoolLogId - 1];
        return supertest(app)
          .get(`/api/school-logs/${schoolLogId}`)
          .expect(200, expectedSchoolLog);
      });
    });

    context(`Given an XSS attack schoolLog`, () => {
      const {
        maliciousSchoolLog,
        expectedSchoolLog,
      } = makeMaliciousSchoolLog();

      beforeEach("insert malicious schoolLog", () => {
        return db.into("school").insert([maliciousSchoolLog]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/school-logs/${maliciousSchoolLog.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.student).to.eql(expectedSchoolLog.student);
            expect(res.body.english).to.eql(expectedSchoolLog.english);
          });
      });
    });
  });

  describe(`POST /api/school-logs`, () => {
    it(`creates a schoolLog, responding with 201 and the new schoolLog`, () => {
      const newSchoolLog = {
        school_date: "Test new date",
        student: "Test new student",
        english: "Test new english",
        math: "Test new math",
        specialty: "Music",
        notes: "Test new notes",
      };
      return supertest(app)
        .post("/api/school-logs")
        .send(newSchoolLog)
        .expect(201)
        .expect((res) => {
          expect(res.body.school_date).to.eql(newSchoolLog.school_date);
          expect(res.body.student).to.eql(newSchoolLog.student);
          expect(res.body.english).to.eql(newSchoolLog.english);
          expect(res.body.math).to.eql(newSchoolLog.math);
          expect(res.body.specialty).to.eql(newSchoolLog.specialty);
          expect(res.body.notes).to.eql(newSchoolLog.notes);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/school-logs/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/school-logs/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = [
      "school_date",
      "student",
      "english",
      "math",
      "specialty",
      "notes",
    ];

    requiredFields.forEach((field) => {
      const newSchoolLog = {
        school_date: "Test new date",
        student: "Test new student",
        english: "Test new english",
        math: "Test new math",
        specialty: "Music",
        notes: "Test new notes",
      };

      it(`responds with 500 and an error message when the '${field}' is missing`, () => {
        delete newSchoolLog[field];

        return supertest(app)
          .post("/api/school-logs")
          .send(newSchoolLog)
          .expect(500);
      });
    });

    it("removes XSS attack content from response", () => {
      const {
        maliciousSchoolLog,
        expectedSchoolLog,
      } = makeMaliciousSchoolLog();
      return supertest(app)
        .post(`/api/school-logs`)
        .send(maliciousSchoolLog)
        .expect(201)
        .expect((res) => {
          expect(res.body.student).to.eql(expectedSchoolLog.student);
          expect(res.body.english).to.eql(expectedSchoolLog.english);
        });
    });
  });

  describe(`DELETE /api/school-logs/:id`, () => {
    context(`Given no articles`, () => {
      it(`responds with 404`, () => {
        const schoolLogId = 123456;
        return supertest(app)
          .delete(`/api/school-logs/${schoolLogId}`)
          .expect(404, { error: { message: `SchoolLog doesn't exist` } });
      });
    });

    context("Given there are schoolLogs in the database", () => {
      const testRecipes = makeSchoolLogArray();

      beforeEach("insert schoolLog", () => {
        return db.into("school").insert(testSchoolLog);
      });
    });
  });

  describe(`PATCH /api/school-logs/:id`, () => {
    context(`Given no schoolLog`, () => {
      it(`responds with 404`, () => {
        const schoolLogId = 123456;
        return supertest(app)
          .delete(`/api/school-logs/${schoolLogId}`)
          .expect(404, { error: { message: `SchoolLog doesn't exist` } });
      });
    });

    context("Given there are schooLogs in the database", () => {
      const testSchoolLog = makeSchoolLogArray();

      beforeEach("insert schoolLog", () => {
        return db.into("school").insert(testSchoolLog);
      });

      it(`responds with 500 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/school-logs/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(500);
      });
    });
  });
});
