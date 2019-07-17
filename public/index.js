
const presetCounts = [
  {
    place: "Escalier A",
    up: 10,
    down: 5
  },
  {
    place: "Hall",
    up: 10,
    down: 5
  },
  {
    place: "PASO sud",
    up: 10,
    down: 5
  }
]

var app = new Vue({
  el: '#app',
  data: {
    counts: presetCounts,
    counterUp: 0,
    counterDown: 0,
    place: ''
  },
  methods: {
    newCount: function(event) {
      const count = {
        place: this.place,
        up: this.counterUp,
        down: this.counterDown
      }

      presetCounts.push(count);

      this.place = '';
      this.counterUp = 0;
      this.counterDown = 0;
    }
  }
})
