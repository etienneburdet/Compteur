
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
  props: ['count','pointIndex'],
  data: function () {
    return {
      point: this.count.points[this.pointIndex]
    }
  },
  computed: {
    downloadPoint: function() {
      const btnsArr = this.point.buttons;
      let dData = 'data:text/csv;sep=;charset=utf-8,%EF%BB%B \r\n';
      btnsArr.forEach(el=> {
        const csvRow = el.name + ';' + el.clicks.join(';') + '\r\n';
        dData += csvRow;
      });

      const blob = new Blob([dData], {type: 'text/csv'});
      const url = window.URL.createObjectURL(blob);

      return url
    }
  },
  methods: {
    registerClick: function (index) {
      this.point.buttons[index].clicks.push(Date())
    },
    endCount: function () {
      const updatedCount = this.count;
      updatedCount.points[this.pointIndex].buttons = this.point.buttons;

      db.put(updatedCount)
        .then( () => {
          fetchAllDocs();
          this.$emit('end-count')
        }).catch( err => console.log(err));
    }
  },
  template: `
  <div class="col-md-8 col-lg-6">
    <div class="card mb-0">
      <div class="card-header">
        {{ count.name }} - {{ point.name }}
      </div>
      <div class="card-body p-0">
        <div class="row no-gutters">
          <button-counter
            v-for="(button, index) in point.buttons"
            :key="button.id" :button="button"
            :done="point.done"
            @button-click="registerClick(index)"
          ></button-counter>
        </div>
      </div>
      <button class="btn btn-primary d-md-none" @click="endCount">Terminer</button>
    </div>
    <a class="btn btn-primary" :href="downloadPoint" download="point.csv">download</a>
  </div>
  `
})

Vue.component('edit-count', {
  props: ['count','pointIndex'],
  data: function() {
    return {
      updatedPoint: this.count.points[this.pointIndex],
    }
  },
  methods: {
    addButton: function() {
      this.updatedPoint.buttons.push(emptyButton());
    },
    deleteButton: function(index) {
      this.updatedPoint.buttons.splice(index,1);
    },
    save: function() {
      const updatedCount = this.count;
      updatedCount.points[this.pointIndex] = this.updatedPoint;

      db.put(updatedCount)
        .then(() => {
          fetchAllDocs();
          this.$emit('saved');
        }).catch(err => console.log(err) );
    }
  },
  template: `
    <div class="col-md-8 col-lg-6">
      <div class="card mb-0">
        <div class="card-header">
          {{count.name}} -
          <input type="text" class="form-control" v-model="updatedPoint.name">
        </div>
        <div class="card-body p-0">
          <div class="row no-gutters">
            <editable-card v-for="(button, index) in updatedPoint.buttons" :key="button.id" v-model="button.name" @delete="deleteButton(index)"></editable-card>
          </div>
          <button class="btn btn-secondary" @click="addButton">+</button>
        </div>
        <button class="btn btn-primary" @click="save">Sauvegarder</button>
      </div>
    </div>
  `
})

Vue.component('editable-card', {
  props: ['value'],
  template: `
    <div class="card m-1" style="width: 18rem;">
      <div class="card-body">
        <input :value="value" @input="$emit('input', $event.target.value)" type="text" class="form-control p-2" >
        <button class="btn btn-secondary" @click="$emit('delete')">X</button>
      </div>
    </div>
  `
})


Vue.component('counts-list', {
  props:['counts'],
  data: function() {
    return {
      newCountName: "Nouveau Comptage",
      newPointName: "Nouveau Point"
    }
  },
  methods: {
    deleteDoc: function(doc) {
      db.remove(doc);
      fetchAllDocs();
    },
    addCount: function() {
        const count = {
          _id: "count"+Date.now().toString(),
          name: this.newCountName,
          points:  [emptyPoint()]
        }

        db.put(count);
        fetchAllDocs();
      },
    addPoint: function(count) {
      const point = {
        id: "point"+Date.now().toString(),
        name: this.newPointName,
        done: false,
        buttons: [emptyButton()]
      }

      count.points.push(point);
      db.put(count).catch(function(err){console.log(err)}) ;
      fetchAllDocs();
    }
  },
  template: `
    <div class="col-md-8 col-lg-6">
      <ul class="list-group">
        <li v-for="count in counts" @click="$emit('select-count', count)" class="list-group-item">
          <div data-toggle="collapse" :data-target="'#' + count._id">
            {{ count.name }} - <button @click="deleteDoc(count)">suppr</button>
          </div>
          <div class="collapse" :id="count._id">
            <ul class="list-group list-group-flush">
              <li v-for="(point, index) in count.points" @click="$emit('select-point', point, index)" class="list-group-item list-group-item-action">
              {{ point.name }} - <button @click="$emit('edit-point', point, index)">edit</button>
              </li>
            </ul>
            <add-to-list @save="addPoint(count)" v-model="newPointName">
              <h3 align="center">+</h3>
            </add-to-list>
          </div>
        </li>
      </ul>
      <add-to-list @save="addCount" v-model="newCountName">
        <h2 align="center">+</h2>
      </add-to-list>
    </div>
  `
})

Vue.component('add-to-list', {
  props: ['value'],
  data: function() {
    return{
      editing: false
    }
  },
  template: ` 
    <ul class="list-group">
      <li class="list-group-item list-group-item-secondary">
        <div v-if="editing == true" class="input-group mb-3">
          <input :value="value" @input="$emit('input', $event.target.value)" class="form-control" type="text">
          <div class="input-group-append">
            <button @click="editing = false; $emit('save')" class="btn btn-secondary">OK</button>
            <button @click="editing = false" class="btn btn-secondary">X</button>
          </div>
        </div>
        <div v-else @click="editing = true">
          <slot></slot>
        </div>
      </li>
    </ul>
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
