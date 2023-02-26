<template>
<div>
    <nav-bar>
        <!-- <template v-slot:left>
        </template> -->
        <template v-slot:default>
            地址管理
        </template>
        <!-- <template v-slot:right>
        </template> -->
    </nav-bar>

    <div class="editAddress">

        <!-- 
            name            name	    是	string	收货人姓名
            addressDetail   address	    是	string	详细地址
            tel             phone	    是	string	收货手机
            province        province    是	string	省份
            city            city	    是	string	城市
            county          county	    是	string	区县
            isDefault       is_default	否	int	是否默认， 值为1是默认， 不传就不设置默认 
        -->
        <van-address-edit
            :area-list="areaList"
            show-delete
            show-set-default
            show-search-result
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
        />
    </div>
    

</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { closeToast, showLoadingToast, showNotify, showToast } from 'vant';
import { addressData, addAddress } from 'network/address.js'
import { areaList } from '@vant/area-data';
import router from '@/router';
export default {
    name: 'AddressEdit',
    components: {
        NavBar
    },

    setup() {
        
        const onSave = (val) => {
            showLoadingToast({ forbidClick: true });
            console.log(val);
            addAddress({
                // name: val.name,
                address: val.addressDetail,
                phone: val.tel,
                province: val.province,
                city: val.city,
                county: val.county,
                is_default: val.isDefault ? 1 : 0
            }).then(res => {
                // console.log(res);
                if (res.status == '201') {
                    closeToast();
                    showToast({
                        message: '添加成功!',
                        duration: 1000,
                        type: 'success'
                    });
                    setTimeout(() => {
                        router.push({
                            path: '/address'
                        })
                    }, 1000);

                }
                else {
                    closeToast();
                    showNotify({
                        message: '出错了, 请确认信息无误或稍后再试!',
                        duration: '2000',
                        type: 'warning'
                    })
                }
            })
            
        };

        const onDelete = () => showToast('delete');

        return {
            onSave,
            onDelete,
            areaList,

        };
    },
}
</script>

<style>
.editAddress {
    margin-top: 50px;
}
</style>