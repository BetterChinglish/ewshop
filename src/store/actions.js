import { getCartData } from 'network/cart.js';

const actions = {
    updateCartCount({ commit }) {
        let num = 0;
        getCartData().then(res => {
            if (res.data) {
                for (let i = 0; i < res.data.length; i++) {
                    num += Number(res.data[i].num);
                }
                commit('setCartCount', num);
            }
        })
    }
};


export default actions;