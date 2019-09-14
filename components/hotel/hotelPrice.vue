<template>
    <div class="hotelPrice">
  <el-row :gutter="20" class="across headlines">
  <el-col :span="5" >
      <div class="headline">价格来源</div>
      </el-col>
  <el-col :span="11">
      <div class="headline centered">低价房型</div>
  </el-col>
  <el-col :span="8"><div class="headline centered">最低价格/每晚</div>
  </el-col>
  
</el-row>
<el-row :gutter="20" class="across hotelSource" v-for="(item,index) in data[0].products" :key="index">
    <a href="http://baidu.com">
  <el-col :span="5"><div class="details">{{item.name}}</div></el-col>
  <el-col :span="11"><div class="details centered ">{{item.bestType}}</div></el-col>
  <el-col :span="8"><div class="details centered dye"><span>￥</span><span>{{item.price}}</span>起<span></span></div></el-col>
    </a>
</el-row>
</div>
</template>

<script>
export default {
props:{
    data:{
        type:Array,
        // 如果调用组件不传值，采用default的默认值
        default:[]
    }
},
mounted(){
    setTimeout(()=>{
    this.data
    // console.log(this.data,123123123)
  },1)
}
}
</script>

<style lang="less" scoped>
.hotelPrice{
    margin: 40px 0;
    .headlines{
        padding: 12px 0;
        border-bottom: 1px solid #ebeef5;
        .headline{
            color:#909399;
            font-size: 14px;
            font-weight:600;
            
        }
        .centered{
            text-align: center;
        }
    };
    .hotelSource{
        border-bottom: 1px solid #ebeef5;
        &:hover{
            background-color: #f5f7fa;
        }
        .details{
            padding: 12px 0;
            
            font-size: 14px;
            color:#606266;
            span{
                color:#f90;
                padding-right: 3px;
                font-size: 16px;
            }
        }
        .centered{
            text-align: center;
        }
    }
}
</style>