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
    <van-divider dashed class="notify" v-if="list.length==0">
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
import { computed, onMounted, reactive, ref } from 'vue';
import { closeToast, showLoadingToast, showToast } from 'vant';
import NavBar from '@/components/common/navbar/NavBar.vue';
import { getAddressList } from '@/network/address';
import { useRouter } from 'vue-router';

export default {
    name: 'Address',
    components: {
        NavBar
    },

    setup() {

        // 选中
        const chosenAddressId = ref();

        // 地址信息
        const list = reactive([]);
        // [{
        //     id: '1',
        //     name: '张三',
        //     tel: '13000000000',
        //     address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
        //     isDefault: true,
        // }]

        const router = useRouter();
            
        // 添加地址
        const onAdd = () => {
            router.push({
                path: '/addressedit'
            })
        };
        const onEdit = (item, index) => {
            // console.log(list[index].id);
            router.push({
                path: '/addressmodify',
                query: {
                    id: list[index].id
                }
            })
        };
        

        onMounted(() => {
            showLoadingToast({ forbidClick: true });

            getAddressList().then(res => {
                list.push(...res.data);
                for (let i = 0; i < list.length; i++) {
                    // console.log(list[i]);

                    // 适配vant组件属性tel与isDefault
                    list[i].tel = computed(()=>list[i].phone)
                    list[i].isDefault = computed(()=>list[i].is_default == 1 ? true : false)

                    // 修改显示的详细地址
                    let address = '';
                    if (list[i].province[2] == '市') {
                        address = list[i].city + list[i].county + ' ' + list[i].address;
                    }
                    else {
                        address = list[i].province + list[i].city + list[i].county + ' ' + list[i].address;
                    }
                    list[i].address = address;
                    // console.log(address);
                    // 选中默认地址
                    if (list[i].is_default == 1) {
                        chosenAddressId.value = list[i].id;
                    }
                }
                // 如果没有设置默认地址, 则选中第一个, 如果没有地址, 仍未空
                if (chosenAddressId.value == null && list.length!=0) {
                    chosenAddressId.value = list[0].id;
                }

                closeToast();
            })
        })
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
    margin-bottom: 100px;
    // height: 85vh;
    // background-color: #d8d7d7;
    

    .van-address-list__bottom {
        margin-bottom: 100px;
        position: fixed;
    }
}
.van-address-item__address {
    text-align: left;
}
.van-address-list__add {
    background-color: #43b883;
}
</style>