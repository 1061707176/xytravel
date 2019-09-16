<template>
  <div class="hoteldetails">
      <!-- 酒店面包屑 -->  
        <div class="crumbs">
            <HotelCrumbs :data="hotelContent"/>
        </div>

        <!-- 酒店名称 -->
            <div class="hotelname">
                <div class="name">
                    <span class="storeName">{{hotelContent[0].name}}</span>
                    <span class="grade iconfont icon-huangguan1"></span>
                    <span class="grade iconfont icon-huangguan1"></span>
                    <span class="grade iconfont icon-huangguan1"></span>
                    <span class="grade iconfont icon-huangguan1"></span>
                    <span class="grade iconfont icon-huangguan1"></span>
                </div>
                <p>{{hotelContent[0].alias}}</p>
                <p><span class="iconfont icon-ditu-dibiao"></span><span>{{hotelContent[0].address}}</span></p>
            </div>
        <!-- 酒店照片 -->
            <div class="hotelImg">
                <el-row :gutter="20">
                <el-col :span="15" class="bigImg"><img src="http://157.122.54.189:9093/images/hotel-pics/1.jpeg" alt=""></el-col>
                <el-col :span="9" class="littleImg">
                    <img src="http://157.122.54.189:9093/images/hotel-pics/1.jpeg" alt="">
                    <img src="http://157.122.54.189:9093/images/hotel-pics/2.jpeg" alt="">
                    <img src="http://157.122.54.189:9093/images/hotel-pics/3.jpeg" alt="">
                    <img src="http://157.122.54.189:9093/images/hotel-pics/4.jpeg" alt="">
                    <img src="http://157.122.54.189:9093/images/hotel-pics/5.jpeg" alt="">
                    <img src="http://157.122.54.189:9093/images/hotel-pics/6.jpeg" alt="">
                </el-col>
                
                </el-row>
            </div>
        <!-- 酒店价钱 -->
            <HotelPrice :data="hotelContent"/>
        <!-- 酒店地图 -->
            <HotelMap :data="hotelContent"/>
        <!-- 酒店的信息设施和服务 -->
            <HotelFacility :data="hotelContent"/>
        <!-- 酒店评论 -->
            <HotelComment :data="hotelContent"/>

  </div>
</template>

<script>
// 这个是tab栏
import HotelCrumbs from '@/components/hotel/hotelCrumbs'
// 这个是价钱
import HotelPrice from '@/components/hotel/hotelPrice'
// 这个是地图
import HotelMap from '@/components/hotel/hotelMap'
// 这个是设施
import HotelFacility from '@/components/hotel/hotelFacility'
// 这个是评论
import HotelComment from '@/components/hotel/hotelComment'
export default {
    data(){
        return{
            // id:4,
            hotelContent:[
                {
                big_cate:'',
                products:[],
                hotelassets:[],
                hotelbrand:{},
                // 评论总数
                // all_remarks:0
                atars:0
                }
                
                ]
        }
    },
    mounted(){
        this.$axios({
            url:"http://157.122.54.189:9095/hotels",
            params:{
                id:this.$route.query.id
            }
        }).then(res=>{
            // console.log(res)
            this.hotelContent = res.data.data
            // console.log(this.hotelContent,123)
        })
    },
    // 引入子组件
    components:{
        HotelCrumbs,
        HotelPrice,
        HotelFacility,
        HotelComment,
        HotelMap
    }
}
</script>

<style lang="less" scoped>

.hoteldetails{
    width: 1000px;
    margin: 0 auto;
    .crumbs{
        padding: 20px 0;
    }
    .hotelname{
        .name{
            .storeName{
                font-size: 24px
            }
            .grade{
                color: yellow;
                padding-right: -3px
            }
        }
        p{
            font-size: 14px
        }
    }
    .hotelImg{
        margin: 40px 0;
        .bigImg{
            img{
                width: 100%;
                height: 360px;
            }
        }
        .littleImg{
            
            img{
                width: 155px;
                padding: 0 10px;
                margin-bottom: 15px;
            }
            // width: 100%;;
            img:nth-last-child(-n+2){
                    margin-bottom: 0
                }
        }
    }
}
</style>
