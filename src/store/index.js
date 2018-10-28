import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import productsModules from './products';
Vue.use(Vuex);

export default new Vuex.Store({
    // state 屬於模組區域變數
    // action, mutations, getters是屬於全域變數
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
        CART(state, payload) {
            state.cart = payload;
        }
    },
    getters: {
        isLoading: state => state.isLoading,
       cart: state => state.cart,

    },
    modules: {
        productsModules,
    }
});