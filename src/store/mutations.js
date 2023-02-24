const mutations = {
    setIsLogin(state, payload) {
        state.user.isLogin = payload;
    },
    setCartCount(state, payload) {
        state.user.cartCount = payload;
    },
    cartCountAdd(state) {
        state.user.cartCount++;
    },
    cartCountSub(state) {
        state.user.cartCount--;
    },
    cartCountSubNum(state, payload) {
        state.user.cartCount -= payload;
    }
};


export default mutations;