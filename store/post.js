
export const state=()=>{
    return {
        nickName:''
    }
}
export const mutations={
   setNickName(state,data){
       state.nickName=data
   }
}