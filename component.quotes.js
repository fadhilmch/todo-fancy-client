Vue.component('quotesbar', {
  template: `
  <div class="quotes">
    <h4>{{quotesvalue.text}}</h4>
    <h3><em>-{{quotesvalue.author}}</em></h3>
  </div>
  `,
  props: ['quotesvalue','title'],
  data () {
    return {

    }
  },
  methods: {

  }
});
