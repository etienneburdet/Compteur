
Vue.component('button-counter', {
  props: ['button'],
  computed: {
    counter: function() {
      return this.button.clicks.length;
    }
  },
  template: `
    <div class="col d-md-none">
      <button  class="btn btn-outline-dark btn-block rounded-0" @click="$emit('button-click')">
        <p> {{ button.name }} </p>
        <h1 class="display-5">{{ counter }}</h1>
      </button>
    </div>
  `
})

Vue.component('counter', {
  props: ['count','point'],
  template: `
  <div class="card mb-0">
    <div class="card-header"> {{ count.name}} - {{ point.object.name }} </div>
    <div class="card-body p-0">
      <div class="row no-gutters">
        <button-counter v-for="(button, index) in point.object.buttons" :key="button.id" :button="button" @button-click="$emit('register-click', index)"></button-counter>
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
      <ul v-for="count in counts" class="list-group">
        <li class="list-group-item list-group-item-action" @click="$emit('select-count', count)" data-toggle="collapse" :data-target="'#' + count.name">
          {{ count.name }}
          <div class="collapse" :id="count.name">
            <ul class="list-group">
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
