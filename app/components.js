const dummyCountsList = [
  {
    name: "St-Lazare",
    points: [
      {
        name: "Escalier face Paul",
        buttons: [
          {id: "3", name: "Flux 1", clicks: ["lol","test"]},
          {id: "4", name: "Flux 2", clicks: ["Salut"]},
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
    name: "Paris-Nord"
  }
]

Vue.component('button-counter', {
  props: ['button'],
  computed: {
    counter: function() {
      return this.button.clicks.length;
    }
  },
  template: `
    <div class="col d-md-none">
      <button  class="btn btn-outline-dark btn-block rounded-0" @click="$emit('register-click')">
        <p> {{ button.name }} </p>
        <h1 class="display-5">{{ counter }}</h1>
      </button>
    </div>
  `
})

Vue.component('counter', {
  data: function() {
    return {
      counts: dummyCountsList
    }
  },
  props: ['count','point'],
  methods: {
    registerClick: function(index) {
       let button = this.counts[this.count.index].points[this.point.index].buttons[index];
       button.clicks.push(Date());
    }
  },
  template: `
  <div class="card mb-0">
    <div class="card-header"> {{ count.object.name}} - {{ point.object.name }} </div>
    <div class="card-body p-0">
      <div class="row no-gutters">
        <button-counter v-for="(button,index) in point.object.buttons" :key="button.id" :button="button" @register-click="registerClick(index)"></button-counter>
      </div>
    </div>
    <button class="btn btn-primary">Save</button>
  </div>
  `
})


Vue.component('counts-list', {
  data: function () {
    return {
      counts: dummyCountsList
    }
  },
  template: `
    <div>
      <ul v-for="(count, index) in counts" class="list-group">
        <li class="list-group-item list-group-item-action" @click="$emit('select-count', count, index)" data-toggle="collapse" :data-target="'#' + count.name">
          {{ count.name }}
          <div class="collapse" :id="count.name">
            <ul class="list-group">
            <li v-for="point in count.points" @click="$emit('select-point', point, index)" class="list-group-item list-group-item-action">
            {{ point.name }}
            </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  `
})
