const db = new PouchDB('comptages', {adapter: 'worker'});
const cloudantDB = new PouchDB('https://ventsionersamoressessime:dd7fbcb5886d6f34f49a22f55bf587a030fa61a2@9cc819eb-31e4-4d0b-b5a2-b47068260a3c-bluemix.cloudantnosqldb.appdomain.cloud/counts');

// Put test data in db
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

// Initialize auth0 functions to be called by the instance

async function configureClient () {

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    this.isAuthenticated = await auth0.isAuthenticated();
     window.history.replaceState({}, document.title, "/");
  } else {
    auth0 = await createAuth0Client({
      domain: "dev-23dd-ysw.eu.auth0.com",
      client_id: "A0nQItIFshhJOBKOTHI36dDcMAF16WzZ"
    });
  }

}


const app = new Vue({
  el: '#app',
  data: {
    counts: '',
    counterUp: 0,
    counterDown: 0,
    place: '',
    isAuthenticated: false
  },
  mounted: function () {
    fetchAllDocs();
    configureClient();
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

    login: async function(event) {
      auth0.loginWithRedirect({
        redirect_uri: window.location.origin
      });
    }

  }
})
