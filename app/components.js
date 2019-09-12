
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
      </ul>
      <add-count></add-count>
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
    <div>
      <div v-if="editing == true" class="input-group mb-3">
        <input :value="value" @input="$emit('input', $event.target.value)" class="form-control" type="text">
        <div class="input-group-append">
          <button @click="editing = false; $emit('save')" class="btn btn-secondary">OK</button>
        </div>
      </div>
      <div v-else @click="editing = true">
        <slot></slot>
      </div>
    </div>
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

Vue.component('add-count', {
  data: function() {
    return {
      countName: "Nouveau Comptage",
      points: [emptyPoint()],
    }
  },
  methods: {
    saveCount: function() {
      const count = {
        _id: "count-"+Date.now().toString(),
        name: this.countName,
        points: this.points
      }

      db.put(count);
      fetchAllDocs();
    }
  },

  template: ` 
    <ul class="list-group">
      <li class="list-group-item list-group-item-secondary" data-toggle="collapse" data-target="#newCount">
        <editable @save="saveCount" v-model="countName"><h2 align="center">+</h2></editable>
      </li>
    </ul>
  `
})
