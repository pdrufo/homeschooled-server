const schoolService = {
  getAllSchoolLogs(knex) {
    return knex
      .from("entries AS e")
      .select(
        "e.id",
        "e.users_id",
        "e.school_date",
        "e.math",
        "e.english",
        "e.specialty",
        "e.notes",
        "u.first_name",
        "u.last_name"
      )
      .innerJoin("users AS u", "e.users_id", "u.id");
  },

  insertSchoolLog(db, newSchoolLog) {
    return db
      .insert(newSchoolLog)
      .into("entries")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select(
        "e.id",
        "e.users_id",
        "e.school_date",
        "e.math",
        "e.english",
        "e.specialty",
        "e.notes",
        "u.first_name",
        "u.last_name"
      )
      .from("entries AS e")
      .innerJoin("users AS u", "e.users_id", "u.id")
      .where("e.id", id)
      .first();
  },
  deleteSchoolLog(db, id) {
    return db("entries").where({ id }).delete();
  },
  updateSchoolLog(db, id, newSchoolLogFields) {
    return db("entries").where({ id }).update(newSchoolLogFields);
  },
};
module.exports = schoolService;
