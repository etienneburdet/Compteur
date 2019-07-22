
const db = new PouchDB('comptages');

const presetCounts = [
  {
    _id: "1",
    place: "Escalier A",
    up: 10,
    down: 5
  },
{
    _id: "2",
    place: "Hall",
    up: 10,
    down: 5
  },
{
    _id: "3",
    place: "PASO sud",
    up: 10,
    down: 5
  }
]

db.bulkDocs(presetCounts);

function fetchAllDocs() {
  return db.allDocs({include_docs: true}).then(function (res) {
    const docs = res.rows.map(function (row) { return row.doc; });
    app.counts = docs;
  }).catch(console.log.bind(console));
}

var app = new Vue({
  el: '#app',
  data: {
    counts: '',
    counterUp: 0,
    counterDown: 0,
    place: ''
  },
  mounted: function () {
    fetchAllDocs();
  },
  methods: {
    newCount: function(event) {
      const count = {
        _id: new Date().toISOString(),
        place: this.place,
        up: this.counterUp,
        down: this.counterDown
      }
      db.put(count);
      fetchAllDocs();

      this.place = '';
      this.counterUp = 0;
      this.counterDown = 0;
    },
    deleteCount: function(count) {
      db.remove(count);
      fetchAllDocs();
    }
  }
})
