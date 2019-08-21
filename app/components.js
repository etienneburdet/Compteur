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
  props: ['buttons'],

})

Vue.component('counts-list', {
  data: function () {
    return {
      selected: {},
      counts:[
        {
          name: "St-Lazare",
          points: [
            {
              name: "Escalier face Paul",
              buttons: ["Flux 1", "Flux 2", "Flux 3"]
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
    }
  },
  template: `
    <div>
      <ul v-for="count in counts" class="list-group">
        <li class="list-group-item list-group-item-action" data-toggle="collapse" :data-target="'#' + count.name">
          {{ count.name }}
        </li>
        <div class="collapse" :id="count.name">
          <ul class="list-group">
            <li v-for="point in count.points" class="list-group-item list-group-item-action">
              {{ point.name }}
            </li>
          </ul>
        </div>
      </ul>
    </div>
  `
})
