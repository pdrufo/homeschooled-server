const schoolService = {
  getAllSchoolLogs(knex) {
    return knex.select("*").from("school");
  },

  insertSchoolLog(db, newSchoolLog) {
    return db
      .insert(newSchoolLog)
      .into("school")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db.select("*").from("school").where("id", id).first();
  },
  deleteSchoolLog(db, id) {
    return db("school").where({ id }).delete();
  },
  updateSchoolLog(db, id, schoolLogToUpdate) {
    return db("school").where({ id }).update(schoolLogToUpdate);
  },
};
module.exports = schoolService;
