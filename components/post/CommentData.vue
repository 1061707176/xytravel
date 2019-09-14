<template>
  <div class="CommentData">
    <!-- 递归 -->
    <CommentData :item="item.parent" v-if="item.parent"/>
    <!-- 递归end -->
    <div class="com_one" @mouseenter="mouseEnterReply()" @mouseleave="mouseLeaveReply()">
      <div class="oneOf_data">
        <div class="release_time">
          <img :src="`${$axios.defaults.baseURL}${item.account.defaultAvatar}`" alt />
          <span>{{item.account.nickname}}</span>
          <span>{{item.created_at | getTime}}</span>
        </div>
        <span>{{item.level}}</span>
      </div>
      <div class="discuss_content">
        <p>{{item.content}}</p>
        <span v-for="(j,i) in item.pics" :key="i" style="display:block;width:150px;height:150px;">
            <img :src="`${$axios.defaults.baseURL}${j.url}`" alt width="100%" />
          </span>
        <div class="Reply">
          <a v-show="isReply" @click="reply(item)" >回复{{item.id}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//引入事件总线
import {bus} from '@/plugins/bus.js'
import Moment from "moment";
export default {
  data() {
    return {
      isReply: false,
      i: -1
    };
  },
  props: {
    item: {
      type: Object,
      default: {}
    },
    isr: {
      type: Boolean,
      default: false
    }
  },
  name: "CommentData",
  mounted() {
    // console.log(this.data);
  },
  filters: {
    getTime(value) {
      let time = Moment(value).format("YYYY-MM-MM hh:mm");
      return time;
    }
  },
  methods: {
    test() {
      console.log(this.isr);
    },
    // 鼠标进入设置显示回复
    mouseEnterReply(item) {
      this.isReply = true;
      bus.$emit("toFatherIsReply");
    },
    // 鼠标离开设置隐藏回复
    mouseLeaveReply() {
      this.isReply = false;
      bus.$emit("toLeaveIsReply");
    },
    //点击回复设置回复的昵称，调用事件总线给父组件传id更改el-tag的显示状态
    reply(item){
        this.$store.commit('post/setNickName',item.account.nickname)
        bus.$emit('isShowTag',item.id)
    }
  }
};
</script>
<style lang="less" scoped>
.CommentData {
  padding: 2px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
.com_one {
  padding: 10px 5px 0px;
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
  // padding: 0 45px;
  padding-left: 25px;
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
    color: #1e50a2;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>