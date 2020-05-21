const express = require("express");
const logger = require("../logger");
const xss = require("xss");

const schoolService = require("./school-service");

const bodyParser = express.json();
const schoolRouter = express.Router();

const serializeSchoolLog = (schoolLog) => ({
  id: schoolLog.id,
  school_date: xss(schoolLog.school_date),
  student: xss(schoolLog.student),
  english: xss(schoolLog.english),
  math: xss(schoolLog.math),
  specialty: xss(schoolLog.specialty),
  notes: schoolLog.notes,
});

schoolRouter
  .route("/api/school-logs")
  .get((req, res, next) => {
    schoolService
      .getAllSchoolLogs(req.app.get("db"))
      .then((schoolLogs) => {
        res.json(schoolLogs.map(serializeSchoolLog));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { school_date, student, english, math, specialty, notes } = req.body;
    if (!school_date || !student || !english || !math || !specialty || !notes) {
      logger.error(
        "school_date, student, english, math, specialty, notes are required"
      );
    }
    const newSchoolLog = {
      school_date,
      student,
      english,
      math,
      specialty,
      notes,
    };
    /**insert new schoolLog into database */
    schoolService
      .insertSchoolLog(req.app.get("db"), newSchoolLog)
      .then((schoolLog) => {
        logger.info(`schoolLog with id ${schoolLog.id} has been created.`);
        res
          .status(201)
          .location(`/api/school-logs/${schoolLog.id}`)
          .json(serializeSchoolLog(schoolLog));
      })
      .catch(next);
  });
/**route for each unique schoolLog in the databse */
schoolRouter
  .route("/api/school-logs/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    schoolService
      .getById(req.app.get("db"), id)
      .then((schoolLog) => {
        if (!schoolLog) {
          logger.error(`schoolLog with id ${id} not found`);
          return res
            .status(404)
            .json({ error: { message: `SchoolLog doesn't exist` } });
        }
        res.schoolLog = schoolLog;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeSchoolLog(res.schoolLog));
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    schoolService
      .deleteSchoolLog(req.app.get("db"), id)
      .then((rowsAffected) => {
        if (rowsAffected < 1) {
          logger.info(`schoolLog with id ${id} not found`);
          res.status(404).send("schoolLog not found");
        }
        logger.info(`schoolLog with id ${id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { school_date, student, english, math, specialty, notes } = req.body;
    const schoolLogToUpdate = {
      school_date,
      student,
      english,
      math,
      specialty,
      notes,
    };

    schoolService
      .updateSchoolLog(
        req.app.get("db"),
        req.params.schoolLog.id,
        schoolLogToUpdate
      )
      .then((numFieldsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = schoolRouter;
