
const db = new PouchDB('comptages');
const cloudantDB = new PouchDB('https://ventsionersamoressessime:dd7fbcb5886d6f34f49a22f55bf587a030fa61a2@9cc819eb-31e4-4d0b-b5a2-b47068260a3c-bluemix.cloudantnosqldb.appdomain.cloud/counts');

// test data ------------
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
// -----------------------

// DB function def to be used in app + initialize DB syncing
db.sync(cloudantDB,{
  live: true,
  retry:true
}).on('complete', function() {
  console.log('sync!');
}).on('error', function (err) {
  console.log(err);
});

function fetchAllDocs() {
  return db.allDocs({include_docs: true}).then(function (res) {
    const docs = res.rows.map(function (row) { return row.doc; });
    app.counts = docs;
  }).catch(console.log.bind(console));
}

// Routes and router definition
const Login = {template: '<p> Salut Etienne </p>'}

const routes = [
  { path: '/login', component: Login}
]

const router = new VueRouter({
  routes
})


const app = new Vue({
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
    },
    fireAuth: function(event) {
      login();
    }
  },
  router
})
