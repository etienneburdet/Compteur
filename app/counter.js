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
      <button  class="btn btn-outline-dark btn-block rounded-0" @click="countUp">
        <p> {{ buttonName }} </p>
        <h1 class="display-5">{{ count }}</h1>
      </button>
  `
})
