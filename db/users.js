var records = [
    { id: 1, username: 'jack', password: 'S6cr3tJ@*', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'b4GH9sd%re', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
  ,{ id: 3, username: 'liam', password: 'Skvdo78+#', displayName: 'Liam', emails: [ { value: 'Liam@NCI.ie' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
    console.log("Error");
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    console.log("Error");
  });
}
