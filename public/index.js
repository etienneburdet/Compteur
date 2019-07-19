
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

function fetchAndRenderAllDocs() {
  return db.allDocs({include_docs: true}).then(function (res) {
    const docs = res.rows.map(function (row) { return row.doc; });
    app.counts = docs;
  }).catch(console.log.bind(console));
}

fetchAndRenderAllDocs();

var app = new Vue({
  el: '#app',
  data: {
    counts: '',
    counterUp: 0,
    counterDown: 0,
    place: ''
  },
  methods: {
    newCount: function(event) {
      const count = {
        place: this.place,
        up: this.counterUp,
        down: this.counterDown
      }

      presetCounts.push(count);

      this.place = '';
      this.counterUp = 0;
      this.counterDown = 0;
    }
  }
})
