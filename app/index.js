/* if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../service-worker.js').then(function (registration)
        {
          console.log('Service worker registered successfully');
        }).catch(function (e)
        {
          console.error('Error during service worker registration:', e);
        });
} */

const db = new PouchDB('comptages');
const cloudantDB = new PouchDB('https://ventsionersamoressessime:dd7fbcb5886d6f34f49a22f55bf587a030fa61a2@9cc819eb-31e4-4d0b-b5a2-b47068260a3c-bluemix.cloudantnosqldb.appdomain.cloud/counts');

// Put test data in db
var dummyCountsList = [
  {
    _id: "test1",
    name: "St-Lazare",
    points: [
      {
        name: "Escalier face Paul",
        done: false,
        buttons: [
          {id: "3", name: "Flux 1", clicks: []},
          {id: "4", name: "Flux 2", clicks: []},
          {id: "5", name: "Flux 3", clicks: []}
        ]
      },
      {
        name: "Ascenceur A",
        buttons: [
          {id: "6", name: "Flux 1", clicks: []},
          {id: "7", name: "Flux 1", clicks: []}
        ]
      },
    ],
  },
  {
    _id: "test2",
    name: "Paris-Nord"
  }
]

var dummyCountsLOL = [
  {
    _id: "test1",
    name: "LOL",
    points: [
      {
        name: "Escalier face Paul",
        done: false,
        buttons: [
          {id: "3", name: "Flux 1", clicks: []},
          {id: "4", name: "Flux 2", clicks: []},
          {id: "5", name: "Flux 3", clicks: []}
        ]
      },
      {
        name: "Ascenceur A",
        buttons: [
          {id: "6", name: "Flux 1", clicks: []},
          {id: "7", name: "Flux 1", clicks: []}
        ]
      },
    ],
  },
  {
    _id: "test2",
    name: "LOL"
  }
]

db.bulkDocs(dummyCountsList);
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


const store = {
  message: "Salut !",
  counts: [],
  fetchAllDocs() {
    return db.allDocs({include_docs: true}).then(function (res) {
      const docs = res.rows.map(function (row) { return row.doc; });
      return docs;
    }).catch(console.log.bind(console));
  }
}

const routes = [
  { path: '/', component: countsList},
  {
    path: '/counter/:countIndex/:pointIndex',
    name: 'counter',
    component: counter,
    props: true
  },
  {
    path: '/editCount/:countIndex/:pointIndex',
    name: 'edit-count',
    component: editCount,
    props: true
  }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  el: '#app',
  data: {
    isAuthenticated: false,
    token: null,
    user: null

  },
  methods: {
    configureClient: async function() {
      auth0 = await createAuth0Client({
        domain: "dev-23dd-ysw.eu.auth0.com",
        client_id: "A0nQItIFshhJOBKOTHI36dDcMAF16WzZ"
      })
    },
    login: async function() {
      await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
      });
    },

    logout: async function() {
      await auth0.logout({
        returnTo: window.location.origin
      });
    },

    handleLogin: async function() {
      const isAuthenticated = await auth0.isAuthenticated();

      const query = window.location.search;
      if (query.includes("code=") && query.includes("state")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
      }
      this.updateLogState();
    },

    updateLogState: async function() {
      this.isAuthenticated = await auth0.isAuthenticated();
      this.token = await auth0.getTokenSilently();
      this.user = await auth0.getUser();
    }
  },
  created: async function() {
    await this.configureClient();
    this.handleLogin();
  },
});
