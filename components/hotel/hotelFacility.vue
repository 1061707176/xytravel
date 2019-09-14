<template>
  <div class="hotelFacility">
      <!-- 基本信息 -->
      <el-row :gutter="20" class="hotelList">
  <el-col :span="4"><div class="title">基本信息</div></el-col>
  <el-col :span="20"><div class="grid-content bg-purple">
      <el-row :gutter="20">
  <el-col :span="6"><div class="grid-content bg-purple">入住时间： 14:00之后</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">离店时间：12:00之前</div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple"></div>{{data[0].creation_time}}/{{data[0].renovat_time}}</el-col>
  <el-col :span="6"><div class="grid-content bg-purple"></div>酒店规模：{{data[0].roomCount}}间客房</el-col>
</el-row>
      </div></el-col>
</el-row>
<el-row :gutter="20" class="hotelList">
  <el-col :span="4"><div class="title">主要设施</div></el-col>
  <el-col :span="20" >
      <span class="grid-content bg-purple main" v-for="(item,index) in data[0].hotelassets" :key="index">{{item.name}}</span>
      </el-col>
</el-row>
<el-row :gutter="20" class="hotelList">
  <el-col :span="4"><div class="title">停车服务</div></el-col>
  <el-col :span="20"><div class="grid-content bg-purple" v-if="data[0].parking">{{data[0].parking}}</div></el-col>
  <el-col :span="20"><div class="grid-content bg-purple" v-if="!data[0].parking">-</div></el-col>
</el-row>
<el-row :gutter="20" class="hotelList">
  <el-col :span="4"><div class="title">品牌信息</div></el-col>
  <el-col :span="20"><div class="grid-content bg-purple" v-if="data[0].hotelbrand">{{data[0].hotelbrand.name}}</div></el-col>
  <el-col :span="20"><div class="grid-content bg-purple" v-if="!data[0].hotelbrand">-</div></el-col>
</el-row>
<!-- 主要设施 -->

<!-- 停车服务 -->

<!-- 品牌信息 -->

  </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Array,
            default:[]
        }
    },
    mounted(){
//         setTimeout(()=>{
//     this.data
//     console.log(this.data,123)
//   },1)
    // this.$axios({
    //     url:"http://157.122.54.189:9095/hotels",
    //         params:{
    //             id:4
    //         }
    // }).then(res=>{
    //     console.log(res,789456123)
    // })
    }
}
</script>

<style lang="less" scoped>
.hotelFacility{
    margin: 40px 0;
    .hotelList{
        padding: 20px 0;
        border-bottom: 1px solid #eeeeee;
        .title{
            font-size: 14px
        }
        .bg-purple{
            color:#666;
            font-size: 14px
        }
        .main{
            display:inline-block;
            padding: 4px 10px;
            margin-right: 10px;
            background-color:#eeeeee;
            border-radius: 5px; 
        }
    }
}
</style>