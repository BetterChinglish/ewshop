<template>
<div>
    <nav-bar>
        <!-- <template v-slot:left>
        </template> -->
        <template v-slot:default>
            地址修改
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
            :address-info="addressInfo"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
        />
    </div>
    <van-popup v-model:show="show" :style="{ padding: '50px' }" class="myPopup">
        <van-button type="default" class="cancleBtn" @click="cancelClick">取 消</van-button>
        <van-button type="danger" @click="sureToDelete">确 认</van-button>
    </van-popup>

</div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar.vue';
import { closeToast, showFailToast, showLoadingToast, showNotify, showSuccessToast, showToast } from 'vant';
import { addressData, addAddress, getAddressDetail } from 'network/address.js'
import { areaList } from '@vant/area-data';
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import { deleteAddress, editAddress } from '@/network/address';
export default {
    name: 'AddressModify',
    components: {
        NavBar
    },

    setup() {
        const route = useRoute();
        const router = useRouter();

        // 保存地址id
        const addressId = route.query.id;  

        // 保存地址信息
        const addressInfo = reactive({
            name: '',
            tel: '',
            province: '',
            city: '',
            county: '',
            addressDetail: '',
            areaCode: '',
            isDefault: false
        })

        // 控制点击删除按钮时的弹出层
        const show = ref(false);

        const cancelClick = () => {
            show.value = false;
        }

        const sureToDelete = () => {
            showLoadingToast({ forbidClick: true });
            deleteAddress(addressId).then(res => {
                console.log(res);
                if (res.status == '204') {
                    closeToast();
                    showToast({
                        message: '删除成功！',
                        duration: 1000,
                        type: 'success'
                    })
                    setTimeout(() => {
                        router.push({
                            path: '/address'
                        })
                    }, 1000);
                }
                else {
                    closeToast();
                    showNotify({
                        message: 'something wrong!',
                        duration: 1500,
                        type: 'warning'
                    })
                }
            })
        }
        onMounted(() => {
            showLoadingToast({ forbidClick: true });
            
            
            getAddressDetail(addressId).then(res => {
                let areaCode = '';
                Object.entries(areaList.county_list).forEach(([id, text]) => {
                    if (text == res.county) {
                        areaCode = id;
                    }
                })
                // console.log(res);
                // console.log(areaList);
                addressInfo.name = res.name;
                addressInfo.tel = res.phone;
                addressInfo.province = res.province;
                addressInfo.city = res.city;
                addressInfo.county = res.county;
                addressInfo.addressDetail = res.address;
                addressInfo.isDefault = res.is_default == 1;
                addressInfo.areaCode = areaCode;
                closeToast();

            })

        });

        const onSave = (val) => {
            showLoadingToast({ forbidClick: true });
            // console.log(val);
            // let address = '';
            // if (val.province[2] == '市') {
            //     address = val.city + val.county + ' ' +val.addressDetail;
            // }
            // else {
            //     address = val.province + val.city + val.county + ' ' + val.addressDetail;
            // }


            editAddress(addressId, {
                name: val.name,
                address: val.addressDetail,
                phone: val.tel,
                province: val.province,
                city: val.city,
                county: val.county,
                is_default: val.isDefault ? 1 : 0
            }).then(res => {
                // console.log(res);
                if (res.status == '204') {
                    closeToast();
                    showToast({
                        message: '修改成功!',
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

        const onDelete = () => {
            show.value = true;
        };

        return {
            onSave,
            onDelete,
            areaList,
            addressInfo,
            show,
            cancelClick,
            sureToDelete,
        };
    },
}
</script>

<style lang="scss">
.editAddress {
    margin-top: 50px;
}

.myPopup {
    border-radius: 10% / 15%;
    .cancleBtn {
        margin-right: 30px;
    }

    .van-button {
        width: 86px;
    }
}
</style>