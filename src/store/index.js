import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    state: {
        isLoading: false,
        cart: {
            carts: [],
          },
    },
    actions: {
        updateLoading(context, status) {
            setTimeout(() => {
                context.commit('LOADING', status)
            }, 100)
        },
        getProducts(context) {
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
            context.commit('LOADING', true)
            axios.get(url).then((response) => {
                context.commit('PRODUCTS', response.data.products);
                context.commit('CATEGORIES', response.data.products);
                console.log('取得產品列表:', response);
                context.commit('LOADING', false)
            });
        },
        getCart(context) {
            context.commit('LOADING', true)
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
            axios.get(url).then((response) => {
                if (response.data.data.carts) {
                    context.commit('CART', response.data.data)
                }
                context.commit('LOADING', false)
                console.log('取得購物車', response.data.data);
            });
        },
        removeCart(context, id) {
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
            context.commit('LOADING', true)
           axios.delete(url).then((response) => {
                context.commit('LOADING', false)
                context.dispatch('getCart')
                console.log('刪除購物車項目', response);
            });
        },
        addtoCart(context, { id, qty }) {
            console.log(context, { id, qty })
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
            const item = {
              product_id: id,
              qty,
            };
            context.commit('LOADING', true)
            axios.post(url, { data: item }).then((response) => {
                context.commit('LOADING', false)
                context.dispatch('getCart')
              console.log('加入購物車:', response);
            });
          },
    },
    mutations: {
        LOADING(state, status) {
            state.isLoading = status;
        },
        PRODUCTS(state, payload) {
            state.products = payload;

        },
        CATEGORIES(state, payload) {
            const categories = new Set();
            payload.products.forEach((item) => {
                categories.add(item.category);
            });
            state.categories = Array.from(categories);
        },
        CART(state, payload) {
            state.cart = payload;
        }
    },
    getters: {
        categories(state) {
            return state.categories;
        },
        products(state) {
            return state.products;
        },

    }
});