
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

Vue.component('counter', {
  props: ['countName','point'],
  template: `
  <div class="col-md-8 col-lg-6">
    <div class="card mb-0">
      <div class="card-header"> {{ countName }} - {{ point.object.name }} </div>
      <div class="card-body p-0">
        <div class="row no-gutters">
          <button-counter v-for="(button, index) in point.object.buttons" :key="button.id" :button="button" :done="point.done" @button-click="$emit('register-click', index)"></button-counter>
        </div>
      </div>
      <button class="btn btn-primary d-md-none" @click="$emit('end-count')">Terminer</button>
    </div>
  </div>
  `
})


Vue.component('counts-list', {
  props:['counts'],
  methods: {
    deleteDoc: function(doc) {
      db.remove(doc);
      fetchAllDocs();
    }
  },
  template: `
    <div class="col-md-8 col-lg-6">
      <ul class="list-group">
        <li v-for="count in counts" @click="$emit('select-count', count)" class="list-group-item" data-toggle="collapse" :data-target="'#' + count.name">
          {{ count.name }} - <button @click="deleteDoc(count)">suppr</button>
          <div class="collapse" :id="count.name">
            <ul class="list-group list-group-flush">
            <li v-for="(point, index) in count.points" @click="$emit('select-point', point, index)" class="list-group-item list-group-item-action">
            {{ point.name }}
            </li>
            </ul>
          </div>
        </li>
        <div class="collapse" id="newCount">
          <add-count></add-count>
        </div>
        <li class="list-group-item list-group-item-secondary" data-toggle="collapse" data-target="#newCount">
          <h2 align="center">+</h2>
        </li>
      </ul>
    </div>
  `
})

Vue.component('editable', {
  props: ['value'],
  data: function() {
    return{
      editing: false
    }
  },
  template: `
  <div v-if="editing == true" class="input-group mb-3">
    <input :value='value' @input="$emit('input', $event.target.value)" type="text" class="form-control">
    <div class="input-group-append">
      <button @click="editing = false" class="btn btn-secondary">OK</button>
    </div>
  </div>
  <p v-else @click="editing = true">{{ value }}</p>
  `
})

Vue.component('add-count', {
  data: function() {
    return {
      countName: "Nouveau Comptage",
      points: [],
    }
  },
  methods: {
    addPoint: function() {
      const point = {
        id: Date.now(),
        name: "Nouveau point",
        done: false,
        buttons: [
          {
            id: Date.now(),
            name: "Nouveau flux",
            clicks: []
          }
        ]
      };
      this.points.push(point);
    },
    addButton: function(point) {
      const button = {
        id: Date.now(),
        name: "Nouveau flux",
        clicks: []
      };
      point.buttons.push(button);
    }
  },
  template: ` 
    <div class="card">
     <div class="card-header">
       <editable v-model="countName"></editable>
     </div>
     <div class="card-body">
      <ul class="list-group list-group-flush">
        <li v-for="point in points" class="list-group-item">
          <ul class="list-group list-group-horizontal">
            <li class="list-group-item">
              <editable v-model="point.name"></editable>
            </li>
            <li v-for="button in point.buttons" class="list-group-item">
              <editable v-model="button.name"></editable>
            </li>
            <li @click="addButton(point)" class="list-group-item">
              <button class="btn btn-secondary">+</button>
            </li>
          </ul>
        </li>
        <li @click="addPoint" class="list-group-item">
          <h3 align="center">+</h3>
        </li>
      </ul>
      <br>
      <button class="btn btn-primary">Sauvergarder</button>
     </div>

    </div>
  `
})
