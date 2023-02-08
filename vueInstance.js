let app = new Vue({
	// the root Vue instance
	el: '#app', // this links to the <div> with the ID #app
	data: {
		customerName: '',
		customerPhone: 0,
		outputMessage: '',
		products: [],
		iconSrc: 'icon.png',
    searchString:'',
		searchList: undefined,
		goToCheckoutPage: false
	},
	methods: {
    async search() {
      const searchString = "E";
      try {
        const rawResponse = await fetch('http://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/search', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({searchString})
        });
        // const data = await rawResponse.json();
        this.searchList = await rawResponse.json();
			  console.log(rawResponse);
			} catch (error) {
			  console.error(error);
			}
    },
    async getLessons() {
      const rawResponse = await fetch('http://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/lessons');
      const lessons = await rawResponse.json();

    },
		async insertOrder() {
      const name = "Biology1";
      const phoneNr = "0772457777";
      const lessonId = "63d503a55fd372e8572c1f12";
      const spaces = 2;
			try {
        const rawResponse = await fetch('http://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/insertOrder', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, phoneNr,lessonId,spaces})
        });
			  // const data = await rawResponse.json();
			  console.log(rawResponse);
			} catch (error) {
			  console.error(error);
			}
    },
    async updateLesson() {
      const sessionId = "63d0f989c83dc58dfa121159";
      const spaces = 0;
			try {
        const rawResponse = await fetch('http://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/updateLessonSpace', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({sessionId, spaces,})
        });
			  // const data = await rawResponse.json();
			  console.log(rawResponse);

			} catch (error) {
			  console.error(error);
			}
		}
	},
	beforeMount() {
		this.search();
	}
});
