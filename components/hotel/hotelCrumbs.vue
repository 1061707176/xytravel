<template>
<!-- 这个是设置酒店面包屑的 -->
  <div class="hotelCrumbs" >
      <el-breadcrumb separator-class="el-icon-arrow-right">
        
    <el-breadcrumb-item :to="{ path: '/' }">{{data[0].big_cate}}</el-breadcrumb-item>
    <el-breadcrumb-item class="jiazu">{{data[0].real_city}}{{data[0].big_cate}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{data[0].name}}</el-breadcrumb-item>
</el-breadcrumb>   
  </div>
</template>

<script>
export default {
props:{
  // data表示组件可以接收的属性
  data:{
    // type不能修改，用于声明属性的类型
    type:Array,
    // 如果调用组件不传值，采用default的默认值
    default:[]
  }
},
methods:{

},
mounted(){
  // console.log(this.data)
  // //  console.log(this.data,123465789)
  // setTimeout(()=>{
  //   this.data
  //   // console.log(this.data,123)
  // },1)
},

}
</script>

<style lang="less" scoped>
.hotelCrumbs{
  .jiazu{
    font-weight: 700;
    color: #303133
  }
}
</style>