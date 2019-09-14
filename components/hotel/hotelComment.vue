<template>
  <div class="hotelComment">
      
    <h4>0条真实用户评论</h4>
    <el-row :gutter="20" class="commentNumber">
      <el-col :span="4">
        <div class="grid-content">总评数：{{data[0].all_remarks}}</div>
        <div>好评数：{{data[0].common_remarks}}</div>
        <div>差评数：{{data[0].bad_remarks}}</div>
      </el-col>
      <el-col :span="5">
        <div class="recommendGrade">
          <div class="grades">
            <!-- <span class="iconfont icon-star"></span>
            <span class="iconfont icon-star"></span>
            <span class="iconfont icon-star"></span>
            <span class="iconfont icon-star"></span>
            <span class="iconfont icon-star"></span>
            <span class="grade">3.5分</span>-->
            <el-rate
              v-model="value5"
              disabled
              show-score
              text-color="#ff9900"
              score-template={value}分
            ></el-rate>
            </div>
          <div class="recommend">推荐</div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">环境</div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">产品</div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">服务</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    data(){
        return{
            value5: 0
        }
    },
  props: {
    // data表示组件可以接收的属性
    data: {
      // type不能修改，用于声明属性的类型
      type: Array,
      // 如果调用组件不传值，采用default的默认值
      default: []
    }
  },
mounted(){
    // 获取分数值
    setTimeout(()=>{
        // console.log(this.data[0].stars)
        this.value5= this.data[0].stars
    },300)
    }
};
</script>

<style lang="less" scoped>
.hotelComment {
  .commentNumber {
    padding: 20px 0;
    .recommendGrade {
      position: relative;
      .grades {
        position: relative;
        margin-top: 20px;
        .grade {
          font-size: 16px;
          color: #ff9900;  
        }
      }

      .recommend {
        position: absolute;
        left: 20px;
        top: -24px;
        border: 2px solid rgba(255, 170, 51, 0.3);
        text-align: center;
        line-height: 70px;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        font-size: 22px;
        color: rgba(255, 153, 0, 0.3);
        transform: rotate(-30deg);
      }
    }
    .bg-purple {
      color: rgb(255, 153, 0);
      margin-top: 25px;
    }
  }
}
</style>