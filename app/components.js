
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
      <card class="d-none d-md-block p-10">
        <p class="card-title">{{ button.name }}</p>
        <h5 class="card-title"> {{ counter }} </h5>
      </card>
    </div>
  `
})

Vue.component('counter', {
  props: ['count','point'],
  template: `
  <div class="col-md-8 col-lg-6">
    <div class="card mb-0">
      <div class="card-header"> {{ count.name}} - {{ point.object.name }} </div>
      <div class="card-body p-0">
        <div class="row no-gutters">
          <button-counter v-for="(button, index) in point.object.buttons" :key="button.id" :button="button" @button-click="$emit('register-click', index)"></button-counter>
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
      <ul v-for="count in counts" class="list-group">
        <li class="list-group-item" @click="$emit('select-count', count)" data-toggle="collapse" :data-target="'#' + count.name">
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
    </div>
  `
})
