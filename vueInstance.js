let app = new Vue({
	// the root Vue instance
	el: '#app', // this links to the <div> with the ID #app
	data: {
		customerName: '',
		customerPhone: 0,
		outputMessage: '',
		products: null,
		iconSrc: 'icon.png',
        cart: [],
        searchString:undefined,
		searchList: [],
		goToCheckoutPage: false
	},
	methods: {
		async getLessons() {
			const rawResponse = await fetch('https://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/lessons');
			const lessons = await rawResponse.json();
			this.products = lessons;
		},
		buy(product) {
            this.removeSpace(this.products, product._id);
            this.removeSpace(this.searchList, product._id);
			this.addSpace(this.cart, product, product._id);
		},
		removeFromCart(product) {
			this.removeSpace(this.cart, product.id);
			this.addSpace(this.products, product.id);
		},
		removeSpace(listOfProducts, productId) {
			for (let i = 0; i < listOfProducts.length; i++) {
				if (listOfProducts[i]._id === productId && listOfProducts[i].space > 0) {
					listOfProducts[i].space--;
				}
			}
		},
		addSpace(listOfProducts, product, productId) {
			let cartHasSameProduct = false;
			for (let i = 0; i < listOfProducts.length; i++) {
				if (listOfProducts[i]._id === productId && listOfProducts[i].space <= 5) {
					listOfProducts[i].space++;
					cartHasSameProduct = true;
				}
			}
			if (cartHasSameProduct == false) {
				const cardProduct = { ...product };
				cardProduct.space = 1;
				this.cart.push(cardProduct);
			}
		},
		countsLessonSpacesInCart() {
			let lessonsCounter = 0;
			for (let i = 0; i < this.cart.length; i++) {
				if (this.cart[i].space > 0) {
					lessonsCounter++;
				}
			}
			return lessonsCounter;
        },
        async searchHandler(){
            if(this.searchString.length==0){
                this.getLessons();
            }else{
                this.search();
            }
        },
		async search() {
            const searchString = this.searchString;
			try {
				const rawResponse = await fetch('https://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/search', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ searchString })
				});
                this.searchList = await rawResponse.json();
			} catch (error) {
				console.error(error);
			}
		},
		async updateLesson(lessonId,spaces) {
			try {
				const rawResponse = await fetch('https://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/updateLessonSpace', {
					method: 'PUT',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ lessonId, spaces })
				});
			} catch (error) {
				console.error(error);
			}
		},
		async insertOrder(lessonId, spaces) {
			const name = this.customerName;
			const phoneNr = this.customerPhone;
			try {
				const rawResponse = await fetch('https://bookshop-env.eba-pxbmjvnm.eu-west-2.elasticbeanstalk.com/insertOrder', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phoneNr, lessonId, spaces })
				});
			} catch (error) {
				console.error(error);
			}
		},
		checkoutHandler() {
			this.cart.map((product, key) => {
                const lessonId = product._id;
				const spaces = product.space;
                this.insertOrder(lessonId, spaces);
                this.products.map((lesson,keh)=>{
                    if(lesson._id==lessonId){
                        this.updateLesson(lessonId,lesson.space);
                    }
                })
            });
            this.cart = [];
		},
		compareAlphabetical(a, b) {
			// Use toUpperCase() to ignore character casing
			const subjectA = a.topic.toUpperCase();
			const subjectB = b.topic.toUpperCase();

			let comparison = 0;
			if (subjectA > subjectB) {
				comparison = 1;
			} else if (subjectA < subjectB) {
				comparison = -1;
			}
			return comparison;
		},
		compareByCity(a, b) {
			// Use toUpperCase() to ignore character casing
			const subjectA = a.location.toUpperCase();
			const subjectB = b.location.toUpperCase();

			let comparison = 0;
			if (subjectA > subjectB) {
				comparison = 1;
			} else if (subjectA < subjectB) {
				comparison = -1;
			}
			return comparison;
		},
		sortAlphabetical() {
			this.products.sort(this.compareAlphabetical);
			this.cart.sort(this.compareAlphabetical);
		},
		sortByCity() {
			this.products.sort(this.compareByCity);
			this.cart.sort(this.compareByCity);
		},
		sortNumerical() {
			this.products.sort((a, b) => a.price - b.price);
			this.cart.sort((a, b) => a.price - b.price);
		}
	},
	created(){
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("service-worker.js");
			}
	},
	beforeMount() {
		this.getLessons();
	}
});
