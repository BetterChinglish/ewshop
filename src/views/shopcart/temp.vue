 <van-cell-group inset>
                    <van-cell
                        v-for="(item, index) in cartList"
                        clickable
                        :key="item.id"
                        @click="toggle(index)"
                    >
                    <template #icon>
                        <van-checkbox
                            :name='item.id'
                            :ref="el=>{checkboxRefs[index] = el}"
                            @click.stop
                        >
                        </van-checkbox>
                    </template>
                    <template #value>
                        <van-swipe-cell>
                        <!-- <van-card
                            num="3"
                            price="2.00"
                            title="商品标题"
                            class="itemGoodsCard"
                            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                        /> -->
                        <van-card
                            :num="item.stock"
                            :price="item.price+'.00'"
                            class="itemGoodsCard"
                            :title="item.title"
                            :thumb="item.cover_url"
                        >
                            <template #footer>
                                <van-stepper 
                                v-model="item.num" 
                                theme="round" 
                                button-size="22" 
                                disable-input 
                                integer
                                min="1"
                                :max="item.stock"
                                :before-change="stepperBeforeChange(index)"
                                :long-press="false"
                            />
                            </template>
                        </van-card>

                        <template #right>
                            <van-button square text="删除" type="danger" class="itemGoodsDeleteBtn" />
                        </template>
                    </van-swipe-cell>
                    </template>
                    </van-cell>
                </van-cell-group>