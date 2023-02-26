<template>
<div>

    <nav-bar>
      <!-- <template v-slot:left>
      </template> -->
      <template v-slot:default>
          我的地址
      </template>
      <!-- <template v-slot:right>
      </template> -->
    </nav-bar>
    <van-divider dashed class="notify">
        您还没有地址哦! 快去添加一个吧~
    </van-divider>
    
    <div class="addressList">
        <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
        />
    </div>
    
</div>
</template>

<script scoped>
import { ref } from 'vue';
import { showToast } from 'vant';
import NavBar from '@/components/common/navbar/NavBar.vue';
import { getAddressList } from '@/network/address';
import router from '@/router';

export default {
    name: 'Address',
    components: {
        NavBar
    },

    setup() {
        const chosenAddressId = ref('1');
        const list = [
            {
                id: '1',
                name: '张三',
                tel: '13000000000',
                address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
                isDefault: true,
            },
            {
                id: '2',
                name: '李四',
                tel: '1310000000',
                address: '浙江省杭州市拱墅区莫干山路 50 号',
            },
        ];

        // 添加地址
        const onAdd = () => {
            router.push({
                path: '/addressedit'
            })
        };
        const onEdit = (item, index) => showToast('编辑地址:' + index);

        return {
            list,
            onAdd,
            onEdit,
            chosenAddressId,
        };
    },
}
</script>

<style lang="scss">
.notify {
    margin-top: 100px;
}
.addressList{
    margin-top: 50px;
    // height: 85vh;
    // background-color: #d8d7d7;
    

    .van-address-list__bottom {
        margin-bottom: 100px;
    }
}

</style>