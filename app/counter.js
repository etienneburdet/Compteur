Vue.component('button-counter', {
  data: function () {
    return {
      clicks: [],
      count: 0
    }
  },
  methods: {
    countUp: function () {
      timeStamp = Date();
      this.clicks.push(timeStamp);
      this.count +=1;
    }
  },
  template: `
    <div>
      <button  class="btn btn-outline-dark btn-block rounded-0" @click="countUp">
        <h1 class="display-5">{{ count }}</h1>
      </button>
      <ul v-for="click in clicks">
        <li>{{ click }}</li>
      </ul>
    </div>
  `
})
