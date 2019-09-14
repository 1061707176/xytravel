<template>
    <div class="asideRaiders">
        <h4>相关攻略</h4>
        <div class="recommend-list" >
            <a v-for="(item,index) in list" :key="index" v-show="index<5" :href="`/post/detail?id=${item.id}`">
                <div class="RaidersOfOne">
                    <div class="img"><img :src="`${item.images[0]}`" alt=""></div>
                    <div class="content">
                        <p class="title">{{item.title}}</p>
                        <span>{{item.created_at|getTime}}</span>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>
<script>
import Moment from 'moment'
export default {
    
    data(){
        return{
            list:[]
        }
    },
    mounted(){
        let id=this.$route.query.id-0;
        this.$axios({
            url:'/posts/recommend',
            params:{id}
        }).then((res)=>{
            this.list=res.data.data
        }).catch((err)=>{
            console.log(err)
        })
    },
    methods:{

    },
    filters:{
        getTime(v){
            let time = Moment(v).format("YYYY-MM-MM hh:mm");
            return time;
        }
    }
}
</script>
<style lang="less" scoped>
.asideRaiders{
    h4{
        font-weight: normal;
        font-size: 18px;
        padding-bottom: 15px;
        border-bottom:1px solid #ccc;
    }
    .recommend-list{

        a{
            display: block;
            padding: 20px 0;
            border-bottom: 1px solid #ccc;
            cursor: pointer;
            .RaidersOfOne{
                display: flex;
               width:100%;
                height: 80px;
                .img{
                    width: 100px;
                    border-right: 1px solid #ccc;
                    img{
                        display: inline-block;
                        width: 100px;
                        height: 100%;
                    }
                }
                .content{
                    padding-left: 10px;
                    .title{
                        height: 62px;
                        &:hover{
                            color:#00cccc;
                        }
                    }
                     span{
                        font-size: 12px;
                        color: #ccc;
                     }
                }
            }
        }
    }
}
</style>