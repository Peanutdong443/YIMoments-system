<template>
  <div class="moments-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
        title="长者圈"
        left-text="返回"
        left-arrow
        fixed
        placeholder
        @click-left="$router.back()"
    />

    <!-- 用户信息头部 -->
    <div class="user-header">
      <div class="user-cover">
        <van-image
            src="./background.jpg"
            fit="cover"
            class="cover-image"
        />
        <div class="user-info">
          <van-image
              round
              width="70"
              height="70"
              src="./nurse.png"
              class="avatar"
          />
          <span class="username" v-if="userInfo.value">{{userInfo.value.UserName}}</span>
        </div>
      </div>
    </div>

    <!-- 朋友圈内容列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <div class="moment-list">
          <div v-for="(item, index) in MomentList" :key="index" class="moment-item">
            <div class="moment-header">
              <van-image
                  round
                  width="40"
                  height="40"
                  :src="item.avatar"
              />
              <div class="moment-user">
                <span class="name">{{ item.Patient_name }}</span>
                <span class="time">{{ item.time }}</span>
              </div>
            </div>

            <div class="moment-content">
              <p>{{ item.Content }}</p>
              <!-- 图片展示 -->
              <div  v-if="item.Media?.Media_url?.length"


                    class="moment-images">
                <van-image
                    v-for="(img, imgIndex) in item.Media.Media_url"
                    :key="imgIndex"
                    :src="img.content"
                    fit="cover"
                    class="moment-image"
                    :class="{'single-image': item.Media.Media_url.length === 1}"
                    @click="previewImage(item.Media.Media_url, imgIndex)"
                />
              </div>
            </div>

            <div class="moment-footer">
              <div class="moment-actions">
                <span class="action-item" @click="toggleLike(item)">
                  <van-icon :name="item.liked ? 'like' : 'like-o'" :color="item.liked ? '#f44336' : ''" />
                  {{ item.likeCount || '' }}
                </span>
                <span class="action-item" @click="showCommentInput(index)">
                  <van-icon name="comment-o" />
                </span>
              </div>

              <!-- 点赞和评论区域 -->
              <div v-if="item.likes || item.comments" class="interaction-area">
                <div v-if="item.likes && item.likes.length > 0" class="likes">
                  <van-icon name="like" color="#f44336" />
                  <span v-for="(like, likeIndex) in item.likes" :key="'like'+likeIndex" class="like-name">
                    {{ like }}
                    <span v-if="likeIndex < item.likes.length - 1">, </span>
                  </span>
                </div>
                <div v-if="item.comments && item.comments.length > 0" class="comments">
                  <div v-for="(comment, commentIndex) in item.comments" :key="'comment'+commentIndex" class="comment-item">
                    <span class="comment-name">{{ comment.name }}: </span>
                    <span class="comment-content">{{ comment.content }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 底部发布按钮 -->
    <div class="publish-btn">
      <van-button round type="primary" icon="plus" @click="showPublish = true" />
    </div>

    <!-- 发布朋友圈弹窗 -->
    <van-action-sheet v-model:show="showPublish" :title="`发布${patient.Patient_name}的长者圈`">
      <div class="publish-content">
        <van-field
            v-model="publishContent"
            rows="4"
            autosize
            type="textarea"
            placeholder="分享内容..."
            class="publish-textarea"
        />
        <div style="text-align: center">
          <van-uploader
              v-model="publishImages"
              multiple
              :max-count="9"
              upload-text="添加图片"
              class="publish-uploader"
          />
        </div>
        <van-button type="primary" block round @click="handlePublish">发布</van-button>
      </div>
    </van-action-sheet>

    <!-- 评论输入框 -->
    <van-action-sheet v-model:show="showComment" title="评论">
      <div class="comment-input-area">
        <van-field
            v-model="commentContent"
            rows="2"
            autosize
            type="textarea"
            placeholder="写下你的评论..."
            class="comment-textarea"
        />
        <van-button type="primary" block round @click="submitComment">发送</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
// eslint-disable-next-line no-unused-vars
import {showFailToast, showImagePreview, showSuccessToast} from 'vant'
import { useStore } from 'vuex';
// eslint-disable-next-line no-unused-vars
import {ysnget, ysnpost, ysnUpfile} from "@/utils/request";

const store = useStore();
const userInfo=reactive({});
const patient=ref({
  Patient_name:"李惠媛",
  Patient_id:"Z00000080",
});
// eslint-disable-next-line no-unused-vars
const MomentList=ref([
  {
    Moment_id: 1,
    Patient_id:null,
    Patient_name: '张三',
    Content:null,
    avatar: 'https://picsum.photos/40',
    time: '2小时前',
    content: '今天天气真好，出去走走~',
    Media:{
      Media_id:null,
      Moment_id:1,
      Media_url:['https://picsum.photos/200/200?random=1'],
      Media_type:null
    },
    likes: ['李四', '王五'],
    comments: [
      { name: '李四', content: '真不错！' },
      { name: '王五', content: '下次一起啊' }
    ],
    liked: false,
    likeCount: 2
  },
  {
    Moment_id: 2,
    Patient_id:null,
    Patient_name: '李四',
    Content:null,
    avatar: 'https://picsum.photos/40?random=4',
    time: '5小时前',
    content: '分享一首好听的歌给大家',
    Media:{
      Media_id:null,
      Moment_id:1,
      Media_url:['https://picsum.photos/200/200?random=1'],
      Media_type:null
    },
    likes: ['张三'],
    comments: [],
    liked: true,
    likeCount: 1
  },
  {
    Moment_id: 3,
    Patient_id:null,
    Patient_name: '王五',
    Content:null,
    avatar: 'https://picsum.photos/40?random=5',
    time: '昨天',
    content: '九宫格照片测试',
    Media:{
      Media_id:null,
      Moment_id:1,
      Media_url:['https://picsum.photos/200/200?random=6',
        'https://picsum.photos/200/200?random=7',
        'https://picsum.photos/200/200?random=8',
        'https://picsum.photos/200/200?random=9',
        'https://picsum.photos/200/200?random=10',
        'https://picsum.photos/200/200?random=11',
        'https://picsum.photos/200/200?random=12',
        'https://picsum.photos/200/200?random=13',
        'https://picsum.photos/200/200?random=14'],
      Media_type:null
    },
    likes: ['张三', '李四', '赵六'],
    comments: [
      { name: '赵六', content: '拍得真好！' }
    ],
    liked: false,
    likeCount: 3
  },
]);
// eslint-disable-next-line no-unused-vars

// 获取用户信息

onMounted(() => {
  userInfo.value = store.state.userInfo;
  console.log(11);
  console.log(userInfo.value);
})



// 列表加载状态
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 发布相关状态
const showPublish = ref(false)
const publishContent = ref('')
const publishImages = ref([])

// 评论相关状态
const showComment = ref(false)
const commentContent = ref('')
const currentCommentIndex = ref(0)

// 多张图片 + 配置项
// eslint-disable-next-line no-unused-vars
const previewImage = (images, index) => {
  showImagePreview({
    images,
    startPosition: index,
    closeable: true
  });
};

// 点赞/取消点赞
// eslint-disable-next-line no-unused-vars
const toggleLike = (item) => {
  item.liked = !item.liked
  if (item.liked) {
    item.likeCount = (item.likeCount || 0) + 1
    if (!item.likes) item.likes = []
    item.likes.push('我')
  } else {
    item.likeCount = Math.max(0, (item.likeCount || 0) - 1)
    if (item.likes) {
      const index = item.likes.indexOf('我')
      if (index > -1) {
        item.likes.splice(index, 1)
      }
    }
  }
}

// 显示评论输入框
// eslint-disable-next-line no-unused-vars
const showCommentInput = (index) => {
  currentCommentIndex.value = index
  showComment.value = true
}

// 提交评论
// eslint-disable-next-line no-unused-vars
const submitComment = () => {
  if (!commentContent.value.trim()) return

  const item = MomentList.value[currentCommentIndex.value]
  if (!item.comments) item.comments = []
  item.comments.push({
    name: '我',
    content: commentContent.value
  })

  commentContent.value = ''
  showComment.value = false
}

// 发布朋友圈
// eslint-disable-next-line no-unused-vars
const handlePublish = async () => {
  if (!publishContent.value.trim() && publishImages.value.length === 0) return

  try {
    loading.value = true;

    // 创建 FormData 对象
    const formData = new FormData();

    // 添加文本内容
    formData.append('Content', publishContent.value);

    // 添加患者信息
    formData.append('Patient_id', patient.value.Patient_id);
    formData.append('Patient_name', patient.value.Patient_name);

    // 添加图片文件
    publishImages.value.forEach((file) => {
      // 注意：这里使用 'MEDIA_FILES' 作为字段名，与后端保持一致
      formData.append('MEDIA_FILES', file.file);
    });

    // 发送请求
    const response = await ysnUpfile("/YlMoments/SaveMoment", formData);

    if (response.istrue) {
      showSuccessToast('动态发布成功');

      // 添加到列表
      const newMoment = {
        Moment_id: response.data?.Moment_id || Date.now(),
        Patient_id: patient.value.Patient_id,
        Patient_name: patient.value.Patient_name,
        Content: publishContent.value,
        avatar: './avatar.jpg',
        time: '刚刚',
        Media: {
          Media_url: publishImages.value.map(img => URL.createObjectURL(img.file))
        },
        likes: [],
        liked: false,
        likeCount: 0
      };

      MomentList.value.unshift(newMoment);

      // 重置表单
      publishContent.value = '';
      publishImages.value = [];
      showPublish.value = false;
    } else {
      showFailToast('动态发布失败');
    }
  } catch (error) {
    console.error('发布失败:', error);
    showFailToast( '网络错误');
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
// eslint-disable-next-line no-unused-vars
const onRefresh = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

// 上拉加载
// eslint-disable-next-line no-unused-vars
const onLoad = () => {
  setTimeout(() => {
    loading.value = false
    // 实际项目中这里应该是请求更多数据
    // 这里模拟数据加载完毕
    finished.value = true
  }, 1000)
}


</script>

<style scoped>
.moments-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

/* 用户头部样式 */
.user-header {
  position: relative;
  height: 200px;
}

.user-cover {
  position: relative;
  height: 200px;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.user-info {
  position: absolute;
  bottom: 5px;
  right: 15px;
  display: flex;
  align-items: center;
}

.user-info .avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info .username {
  margin-left: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 朋友圈列表样式 */
.moment-list {
  padding: 15px;
  background-color: #fff;
}

.moment-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.moment-item:last-child {
  border-bottom: none;
}

.moment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.moment-user {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.moment-user .name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.moment-user .time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.moment-content p {
  margin: 0 0 10px 50px;
  font-size: 15px;
  line-height: 1.5;
  color: #333;
}

/* 图片展示样式 */
.moment-images {
  margin-left: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.moment-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.single-image {
  padding-bottom: 75%;
}

/* 底部操作区域 */
.moment-footer {
  margin-left: 50px;
}

.moment-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.action-item {
  margin-left: 15px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.action-item .van-icon {
  margin-right: 3px;
  font-size: 16px;
}

/* 互动区域样式 */
.interaction-area {
  background-color: #f7f7f7;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 5px;
}

.likes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.likes .van-icon {
  margin-right: 5px;
}

.like-name {
  color: #576b95;
}

.comment-item {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 5px;
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-name {
  color: #576b95;
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 100;
}

.publish-btn .van-button {
  width: 50px;
  height: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 发布弹窗样式 */
.publish-content {
  padding: 15px;
}

.publish-textarea {
  background-color: #f7f7f7;
  border-radius: 8px;
  margin-bottom: 15px;
}

.publish-uploader {
  margin-bottom: 20px;
}

/* 评论弹窗样式 */
.comment-input-area {
  padding: 15px;
}

.comment-textarea {
  background-color: #f7f7f7;
  border-radius: 8px;
  margin-bottom: 15px;
}
</style>