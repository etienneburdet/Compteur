
const counter = Vue.component('counter', {
  props: ['countIndex','pointIndex'],
  data: function () {
    return {
      count: {},
      point: {}
    }
  },
  computed: {
    downloadPoint: function() {
      const btnsArr = this.point.buttons;
      let dData = 'data:text/csv;sep=;charset=utf-8,%EF%BB%B \r\n';
      btnsArr.forEach(el=> {
        const csvRow = el.name + ';' + el.clicks.join(';') + '\r\n';
        dData += csvRow;
      });

      const blob = new Blob([dData], {type: 'text/csv'});
      const url = window.URL.createObjectURL(blob);

      return url
    }
  },
  methods: {
    registerClick: function(index) {
      const clickTime = new Date();
      const stringClickTime = clickTime.getDay().toString() + '-'
                              + clickTime.getMonth().toString() + '-'
                              + clickTime.getMonth().toString() + ' '
                              + clickTime.getHours().toString() + ':'
                              + clickTime.getMinutes().toString() + ':'
                              + clickTime.getSeconds().toString();


      this.point.buttons[index].clicks.push(stringClickTime);
    },
    endCount: function() {
      db.put(this.count)
        .then(() => {
          router.push('/');
        }).catch(err => console.log(err) );
    }
  },
  created: async function() {
    store.counts = await store.fetchAllDocs();
    this.count = store.counts[this.countIndex],
    this.point = store.counts[this.countIndex].points[this.pointIndex]
  },
  template: `
  <div class="col-md-8 col-lg-6">
    <div class="card mb-0">
      <div class="card-header">
        {{ count.name }} - {{ point.name }}
      </div>
      <div class="card-body p-0">
        <div class="row no-gutters">
          <button-counter v-for="(button, index) in point.buttons" :key="button.id" :button="button" :done="point.done" @button-click="registerClick(index)">{{ index }}</button-counter>
        </div>
      </div>
      <button class="btn btn-primary d-md-none" @click="endCount">Terminer</button>
    </div>
    <a class="btn btn-block btn-secondary" :href="downloadPoint" download="point.csv"><i class="fas fa-file-download fa-2x"></i></a>
  </div>
  `
})

Vue.component('button-counter', {
  props: ['button'],
  computed: {
    counter: function() {
      return this.button.clicks.length;
    }
  },
  template: `
    <div class="col">
      <button  class="btn btn-outline-dark btn-block rounded-0 d-md-none" @click="$emit('button-click')">
        <p> {{ button.name }} </p>
        <h1 class="display-5">{{ counter }}</h1>
      </button>
      <div class="card d-none d-md-block p-10">
        <p class="card-title">{{ button.name }}</p>
        <h5 class="card-title"> {{ counter }} </h5>
      </div>
    </div>
  `
})



const editCount = Vue.component('edit-count', {
  props: ['countIndex','pointIndex'],
  data: function() {
    return {
      count: {},
      point: {}
    }
  },
  methods: {
    addButton: function() {
      this.point.buttons.push(emptyButton());
    },
    deleteButton: function(index) {
      this.point.buttons.splice(index,1);
    },
    save: function() {
      db.put(this.count)
        .then(() => {
          router.push('/');
        }).catch(err => console.log(err) );
    }
  },
  created: async function() {
    store.counts = await store.fetchAllDocs();
    this.count = store.counts[this.countIndex],
    this.point = store.counts[this.countIndex].points[this.pointIndex]
  },
  template: `
    <div class="col-md-8 col-lg-6">
      <div class="card mb-0">
        <div class="card-header">
          {{count.name}} -
          <input type="text" class="form-control" v-model="point.name">
        </div>
        <div class="card-body p-0">
          <div class="row no-gutters">
            <editable-card v-for="(button, index) in point.buttons" :key="button.id" v-model="button.name" @delete="deleteButton(index)"></editable-card>
          </div>
          <button class="btn btn-secondary" @click="addButton">+</button>
        </div>
        <button class="btn btn-primary" @click="save">Sauvegarder</button>
      </div>
    </div>
  `
})

Vue.component('editable-card', {
  props: ['value'],
  template: `
    <div class="card m-1" style="width: 18rem;">
      <div class="card-body">
        <input :value="value" @input="$emit('input', $event.target.value)" type="text" class="form-control p-2" >
        <button class="btn btn-secondary" @click="$emit('delete')">X</button>
      </div>
    </div>
  `
})

const countsList = Vue.component('counts-list', {
  data: function() {
    return {
      counts: [],
      newCountName: "Nouveau Comptage",
      newPointName: "Nouveau Point"
    }
  },
  methods: {
    salut: function() {
      monMessage = "Salut";
    },
    deleteDoc: async function(doc) {
      db.remove(doc);
      store.counts = await store.fetchAllDocs();
      this.counts = store.counts;
    },
    addCount: async function() {
        const count = {
          _id: "count"+Date.now().toString(),
          name: this.newCountName,
          points:  [emptyPoint()]
        }
        db.put(count);
        store.counts = await store.fetchAllDocs();
        this.counts = store.counts;
      },
    addPoint: async function(count) {
      const point = {
        id: "point"+Date.now().toString(),
        name: this.newPointName,
        done: false,
        buttons: [emptyButton()]
      }

      count.points.push(point);
      db.put(count).catch(function(err){console.log(err)}) ;
      store.counts = await store.fetchAllDocs();
    },
    createRoute: function(name,countIndex,pointIndex) {
      const route = {
        name: name,
        params: {
          countIndex: countIndex,
          pointIndex: pointIndex
        },
      }
      return route
    }
  },
 created: async function() {
   store.counts = await store.fetchAllDocs();
   this.counts = store.counts;
 },
  template: `
    <div class="col-md-8 col-lg-6">
      <ul class="list-group">
        <li v-for="(count, countIndex) in counts" class="list-group-item">
          <div data-toggle="collapse" :data-target="'#' + count._id">
            {{ count.name }}
            <button @click="deleteDoc(count)" class="btn btn-light" style="float: right;">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="collapse" :id="count._id">
            <ul class="list-group list-group-flush">
              <li v-for="(point, pointIndex) in count.points" class="list-group-item list-group-item-action">
                <router-link :to="createRoute('counter',countIndex,pointIndex)">
                  {{ point.name }}
                </router-link>
                <router-link :to="createRoute('edit-count',countIndex, pointIndex)">
                 <button @click="deleteDoc(count)" class="btn btn-light" style="float: right;">
                  <i class="far fa-edit"></i>
                </button>
               </router-link>
              </li>
            </ul>
            <add-to-list @save="addPoint(count)" v-model="newPointName">
              <h3 align="center">+</h3>
            </add-to-list>
          </div>
        </li>
      </ul>
      <add-to-list @save="addCount" v-model="newCountName">
        <h2 align="center">+</h2>
      </add-to-list>
    </div>
  `
})

Vue.component('add-to-list', {
  props: ['value'],
  data: function() {
    return{
      editing: false
    }
  },
  template: ` 
    <ul class="list-group">
      <li class="list-group-item list-group-item-secondary">
        <div v-if="editing == true" class="input-group mb-3">
          <input :value="value" @input="$emit('input', $event.target.value)" class="form-control" type="text">
          <div class="input-group-append">
            <button @click="editing = false; $emit('save')" class="btn btn-secondary">OK</button>
            <button @click="editing = false" class="btn btn-secondary">X</button>
          </div>
        </div>
        <div v-else @click="editing = true">
          <slot></slot>
        </div>
      </li>
    </ul>
  `
})

//empty buttons and points to be used as default/reset values in add-count component
function emptyButton() {
  return {
    id: Date.now(),
    name: "Nouveau flux",
    clicks: []
  }
}

function emptyPoint() {
    return {
      id: Date.now(),
      name: "Nouveau point",
      done: false,
      buttons: [emptyButton()]
    }
}
