Vue.component('button-counter', {
  data: function () {
    return {
      clicks: [],
      count: 0
    }
  },
  props: ['buttonName'],
  methods: {
    countUp: function () {
      timeStamp = Date();
      this.clicks.push(timeStamp);
      this.count +=1;
    }
  },
  template: `
    <div class="col d-md-none">
      <button  class="btn btn-outline-dark btn-block rounded-0" @click="countUp">
        <p> {{ buttonName }} </p>
        <h1 class="display-5">{{ count }}</h1>
      </button>
    </div>
  `
})

Vue.component('counter', {
  props: ['point'],
  template: `
  <div class="card mb-0">
    <div class="card-header"> {{ point.name }} </div>
    <div class="card-body p-0">
      <div class="row no-gutters">
        <button-counter v-for="button in  point.buttons" :key="button.id" :button-name="button.name"></button-counter>
      </div>
    </div>
  </div>
  `

})

const dummyCountsList = [
  {
    name: "St-Lazare",
    points: [
      {
        name: "Escalier face Paul",
        buttons: [{id: "3", name: "Flux 1"}, {id: "4", name: "Flux 2"}, {id: "5", name: "Flux 3"}]
      },
      {
        name: "Ascenceur A",
        buttons: ["Flux 1", "Flux 2"]
      },
    ],
  },
  {
    name: "Paris-Nord"
  }
]

Vue.component('counts-list', {
  data: function () {
    return {
      selectedPoint: {},
      counts: dummyCountsList
    }
  },
  methods: {
    selectPoint: function (point) {
      this.selectedPoint = point;
    }
  },
  template: `
    <div>
      <ul v-for="count in counts" class="list-group">
        <li class="list-group-item list-group-item-action" data-toggle="collapse" :data-target="'#' + count.name">
          {{ count.name }}
          <div class="collapse" :id="count.name">
          <ul class="list-group">
          <li v-for="point in count.points" @click="selectPoint(point)" class="list-group-item list-group-item-action">
          {{ point.name }}
          </li>
          </ul>
          </div>
        </li>
      </ul>
        <counter :point="selectedPoint"></counter>
    </div>
  `
})
