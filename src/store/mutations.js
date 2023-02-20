const mutations = {
    setIsLogin(state, payload) {
        state.user.isLogin = payload;
    },
    setCartCount(state, payload) {
        state.user.cartCount = payload;
    }
};


export default mutations;