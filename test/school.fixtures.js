function makeSchoolLogArray() {
    return [
      {
        id: 1,
        school_date: "05/01/2020",
        student: "John",
        english: "reading",
        math:
          "module 2",
        specialty: "Art",
        notes: "none",
      },
      {
        id: 2,
        school_date: "05/02/2020",
        student: "John",
        english: "reading again",
        math:
          "module 3",
        specialty: "Music",
        notes: "all done",
      },
      {
        id: 3,
        school_date: "05/03/2020",
        student: "John",
        english: "writing",
        math:
          "module 4",
        specialty: "Gym",
        notes: "good job",
      },
    ];
  }
  
  function makeMaliciousSchoolLog() {
    const maliciousSchoolLog = {
      id: 911,
      school_date: 'Naughty naughty very naughty <script>alert("xss");</script>',
      student: "John",
      english: "bad stuff",
      math:
        "very bad stuff",
      specialty: "Gym",
      notes: "bad stuff",
    };
    const expectedSchoolLog = {
      ...maliciousSchoolLog,
      school_date: 'Naughty naughty very naughty <script>alert("xss");</script>',
      student: "John",
      english: "bad stuff",
      math:
        "very bad stuff",
      specialty: "Gym",
      notes: "bad stuff",
    };
    return {
      maliciousSchoolLog,
      expectedSchoolLog,
    };
  }
  module.exports = { makeSchoolLogArray, makeMaliciousSchoolLog };