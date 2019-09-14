<template>
  <div class="discuss">
    <div class="oneOf" v-for="(item,index) in data" :key="index">
      <div class="test"  @mouseenter="mouseEnterReply(index)" @mouseleave="isReply=false">
        <div class="oneOf_data">
          <div class="release_time">
            <img :src="`http://127.0.0.1:1337${item.account.defaultAvatar}`" alt />
            <span>{{item.account.nickname}}</span>
            <span>{{item.created_at | getTime}}</span>
          </div>
          <span>{{item.level}}</span>
        </div>
        <div class="discuss_content">
          <!-- 判断是否有parent对象给子组件传值 -->
          <CommentData :item="item.parent" :isr="isReply" v-if="item.parent"  />
          <p>{{item.content}}</p>
          <span v-for="(j,i) in item.pics" :key="i" style="display:block;width:150px;height:150px;">
            <img :src="`${$axios.defaults.baseURL}${j.url}`" alt width="100%" />
          </span>
          <div class="Reply" >
            <a v-show="isReply&&i==index" @click="reply(item,index)">回复{{item.id}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//事件总线
import {bus} from '@/plugins/bus.js'
import Moment, { fn } from "moment";
import CommentData from "@/components/post/CommentData.vue";
export default {
  data(){
    return{
      isReply:false,
      i:-1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    CommentData
  },
  methods: {
    mouseEnterReply(index){
      this.i=index;
      this.isReply=true;
    },
    getSonIsReply(){
     this.isReply=false
    },
    getSonLeave(){
      this.isReply=true
    },
    reply(item,index){
        this.$store.commit('post/setNickName',item.account.nickname)
        this.$emit('isShowTag',item.id)
    }
  },
  //过滤时间
  filters: {
    getTime(value) {
      let time = Moment(value).format("YYYY-MM-MM hh:mm");
      return time;
    }
  },
  //监听子组件传的事件
  created(){
    bus.$on('toFatherIsReply',()=>{
      this.isReply=false
    });
    bus.$on('toLeaveIsReply',()=>{
      this.isReply=true
    });
  }
};
</script>
<style lang="less" scoped>
.discuss {
  width: 100%;
  // border: 1px solid #ccc;
  margin-top: 30px;
}
.release_time {
  /deep/img {
    width: 16px;
    height: 16px;
  }
}
.oneOf_data {
  display: flex;
  justify-content: space-between;
  padding: 15px;
}
.discuss_content {
  padding: 0 45px;
  box-sizing: border-box;
}
.oneOf {
  border-bottom: 1px dashed silver;
}
.Reply {
  height: 20px;
  padding-bottom: 10px;
  a {
    float: right;
    font-size: 12px;
    color:#1e50a2;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
}


/deep/.el-upload--picture-card{
   width: 100px;
    height: 100px;
    line-height: 100px;
}
</style>