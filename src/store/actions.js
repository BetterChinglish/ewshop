import { getCartData } from 'network/cart.js';

const actions = {
    updateCartCount({commit}) {
        getCartData().then(res => {
            console.log(res);
            commit('setCartCount', res.data ? res.data.length : 0)
        })
    }
};


export default actions;