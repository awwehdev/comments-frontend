<template>
  <div class="loader" v-if="loading">
    <svg width="150" height="150" id="loader">
      <circle fill="red">
        <animate attributeName="cx" values="15;135;15" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;7.5;2;7.5;15" keyTimes="0;0.25;0.5;0.75;1" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="135;15;135" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle fill="green">
        <animate attributeName="cx" values="135;15;135" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;7.5;2;7.5;15" keyTimes="0;0.25;0.5;0.75;1" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="15;135;15" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle fill="blue">
        <animate attributeName="cx" values="15;135;15" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;7.5;2;7.5;15" keyTimes="0;0.25;0.5;0.75;1" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="15;135;15" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle fill="orange">
        <animate attributeName="cx" values="135;15;135" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="r" values="15;7.5;2;7.5;15" keyTimes="0;0.25;0.5;0.75;1" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="135;15;135" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.74 0.11 0.3 0.85; 0.74 0.11 0.3 0.85;" dur="6s" repeatCount="indefinite"/>
      </circle>
    </svg>
  </div>
  <div class="comments" :style="{background:background}" ref="wrapper" v-else @click="$emit('close-picker')">
    <div class="innerWrapper">
      <div class="addComment" key="addComment">
        <div class="avatar">
        </div>
        <div class="commentBox" key="commentBox" v-show="!showSignPanel && !auth || auth " :style='{margin: "0 auto"}'>
             <input
                type="text"
                name="name"
                placeholder="Your name"
                aria-label="Your name"
                class="addComment" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                v-model="userName"
              >
              <br />
              <input
                type="email"
                name="email"
                placeholder="Your E-Mail"
                aria-label="Your E-Mail" 
                class="addComment" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                v-model="email"
              >
              <br />
              <input
                type="text"
                name="homepage"
                placeholder="Homepage"
                aria-label="Homepage"
                class="addComment" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                v-model="homepage"
              >
              <br />
            <textarea 
              name="addComment" 
              class="addComment" 
              ref="addComment" 
              placeholder="Add new comment" 
              @keyup="resize"
              v-model="newComment"
              :style="{background:commentBackgroundColor, color: commentTextColor}"
              spellcheck="false"
              aria-label="Add comment"
            ></textarea>
            <br />
              <div class="remainingLetter" :style="{ color: remainingLetter<0 ? 'rgba(255, 82, 82,1)' :'rgba(42, 94, 190, 1)'}">
              <span>{{remainingLetter}}</span>
            </div>
            <br />
            <button aria-label="Send" v-if="requestLoading"><div class="requestLoading"></div></button>
            <button @click="addComment" aria-label="Send" v-else>Send</button>
            <transition name="fade">
              <div class="alert" v-if="alert" :class="alertClass" :key="alertClass" style="align-self:start; margin-top: -5px;">
                <div>{{alertMessage}}</div>
              </div>
            </transition>
        </div>        
        <sign-wrapper 
          v-if="showSignPanel && !auth" 
          :baseURL="baseURL" 
          :apiKey="apiKey"
          :maxUserNameLength="maxUserNameLength" 
          v-on:sign-user="signUser"
        ></sign-wrapper>
      </div>
      <transition-group 
        appear 
        name="fade" 
        mode="out-in" 
        tag="div">
        <app-wrapper 
          v-for="(item, index) in comments"
          v-if="index < limit" 
          :baseURL="baseURL"
          :apiKey="apiKey"
          :key="item.id" 
          :id="item.id"
          :timestamp="item.created_at"
          :lineCount="item.children.length"
          :maxUserNameLength="maxUserNameLength"
          :maxCommentLength="maxCommentLength"
          :maxShowingDepth="maxShowingDepth"
          :maxLineLimit="maxLineLimit"
          :nodeUserId="item.user_id"
          :nodeName="nodeName"
          :name="item.name"
          :email="item.email"
          :homepage="item.homepage"
          :comment="item.text"
          :replies="item.children"
          :replys="item.name"
          :depth="item.depth"
          :depthLength="1"
          v-on:delete-row="deleteFromParent(index)"
          v-on:sign-user="signUser"
          :initialMessageLimit="initialMessageLimit"
          :auth="auth"
          :userId="userId"
          :idToken="idToken"
          :isAdmin="isAdmin"
          :userName="userName"
          :commentBackgroundColor="commentBackgroundColor"
          :commentTextColor="commentTextColor"
          :userNameColor="userNameColor"
          :wrapperSize="wrapperSize.toString()"
          :custom="custom"
        ></app-wrapper>
        <div class="noCommentWrapper" @click="$refs.addComment.focus()" v-if="comments.length<1" key="noComment">
          <span class="noCommentText">Be the first to comment.</span>
        </div>
      </transition-group>
      <div class="updateLimit" @click="updateLimit" v-if="limit < comments.length">
        <span class="limit">Show more comment</span>
      </div>
    </div>
  </div>
</template>

<script>
  'use strict';
  import Wrapper from './Comment.vue'
  import Sign from './Sign.vue'
  import axios from 'axios'

  export default {
    name: 'Comments',
    props: {
      baseURL: {
        type: String,
        required: true
      },
      apiKey: {
        type: String,
        required: true
      },
      nodeName: {
        type: String,
        required: true
      },
      maxUserNameLength: {
        type: String,
        default: '30'
      },
      maxCommentLength: {
        type: String,
        default: '1000'
      },
      initialMessageLimit: {
        type: String,
        default: '10'
      },
      maxLineLimit: {
        type: String,
        default: '40'
      },
      maxShowingDepth: {
        type: String,
        default: '5'
      },
      background: {
        type: String,
        default: 'transparent'
      },
      commentBackgroundColor: {
        type: String,
        default: 'white'
      },
      commentTextColor: {
        type: String,
        default: '#1d2129'
      },
      userNameColor: {
        type: String,
        default: 'rgb(6, 177, 183)'
      },
      custom: {
        type: String,
        default: 'false'
      }
    },
    data() {
      return {
        loading: true,
        showSignPanel: false,
        comments: [],
        newComment: '',
        styleShadow: {
          boxShadow: '1px -1px rgba(' + Math.round(Math.random() * 244) + ',' + Math.round(Math.random() * 244) + ',' + Math.round(Math.random() * 244) + ',0.6)'
        },
        limit: parseInt(this.initialMessageLimit),
        alertMessage: '',
        alertClass: '',
        alert: false,
        idToken: null,
        userId: null,
        isAdmin: null,
        userName: '',
        email: '',
        homepage: '',
        expiresIn: null,
        auth: false,
        wrapperSize: '',
        requestLoading: false,
        logOutTimer: null
      }
    },
    methods: {
      checkAutoLogin() {
        const token = localStorage.getItem('commentToken')
        if (!token) {
          return
        }
        const expirationDate = localStorage.getItem('commentExpirationDate')
        const now = new Date()
        const remainingTime = Math.floor((new Date(expirationDate).getTime() - now.getTime()) / 1000);
        if (now >= expirationDate) {
          return
        }
        const userId = localStorage.getItem('commentUserId')
        const userName = localStorage.getItem('commentUserName')
        if(localStorage.getItem('commentAdmin') != 'undefined'){
          const data = [token, userId, userName, remainingTime, true]
          this.signUser(data);
        } else {
          const data = [token, userId, userName, remainingTime]
          this.signUser(data);
        }
      },
      signUser(data) {
        this.idToken = data[0]
        this.userId = data[1]
        this.userName = data[2]
        this.expiresIn = data[3]
        this.logOutTimer = setTimeout(() => {
          this.clearAuth()
        }, this.expiresIn * 1000);
        this.isAdmin = data[4]
        this.auth = true
        this.showSignPanel = false
      },
      clearAuth() {
        clearTimeout(this.logOutTimer);
        this.idToken = ''
        this.userId = ''
        this.userName = ''
        this.isAdmin = null
        this.auth = false
        localStorage.removeItem("commentToken")
        localStorage.removeItem("commentUserId")
        localStorage.removeItem("commentExpirationDate")
        localStorage.removeItem("commentUserName")
        localStorage.removeItem("commentAdmin")
      },
      updateLimit() {
        this.limit += parseInt(this.initialMessageLimit)
      },
      resize(event) {
        if (this.newComment == '') {
          this.$refs.addComment.style.height = 'auto'
          this.$refs.addComment.style.height = 32 + 'px'
        } else {
          event.target.style.height = 'auto'
          event.target.style.height = event.target.scrollHeight + "px"
        }
      },
      addComment() {
        if (this.custom != 'false') {
          this.setAlert('This for customization, if you want to comment please look at the Fullscreen demo.\n', 'fail')
          return
        }
        // if (this.auth) {
          if (this.filterNewComment.length!=0) {
            this.requestLoading = true;
            let commentObj = { name: this.filterUserName, text: this.filterNewComment, email: this.filterEmail, homepage: this.filterHomepage, topic: this.nodeName, children: [], reply_id: this.id}
            axios.post(this.baseURL + 'api/user/comments' + '?bearerToken=' + this.apiKey, commentObj)
              .then(res => {
                commentObj.id = res.data.data.id;
                commentObj.created_at = res.data.data.created_at;
                const repliedObj = { user_id: this.userId }
                commentObj.depth = 'commentsGrid/' + this.nodeName + '/comments/' + commentObj.id
                this.comments.splice(0, 0, commentObj)
                this.clearAlert()
                this.newComment = ''
                this.resize()
              })
              .catch(err => this.setAlert(err.response.data.message ? err.response.data.message : 'Invalid comment', 'fail'))
          } else {
            this.setAlert('You can\'t send empty comment!\n', 'fail')
          }
        // } else {
        //   this.showSignPanel = false
        // }
      },
      deleteFromParent(index) {
        this.comments.splice(index, 1)
      },
      setAlert(message, style, type) {
        type == 'append' ? this.alertMessage += message : this.alertMessage = message
        this.alertClass = style
        this.alert = true
        this.requestLoading = false;
        setTimeout(() => {
          this.clearAlert();
        }, 500000);
      },
      clearAlert() {
        this.requestLoading = false;
        this.alertMessage = ''
        this.alertClass = ''
        this.alert = false
      }
    },
    computed: {
      remainingLetter() {
        if (this.maxCommentLength <= this.newComment.length) {
          return 0;
        }

        return +(this.maxCommentLength) - this.newComment.length
      },
      filterUserName() {
        return this.userName.replace(/^ +/g, '').replace(/ +/g, ' ').replace(/ +$/g, '')
      },
      filterEmail() {
        return this.email.replace(/^ +/g, '').replace(/ +/g, ' ').replace(/ +$/g, '')
      },
      filterHomepage() {
        return this.homepage.replace(/^ +/g, '').replace(/ +/g, ' ').replace(/ +$/g, '')
      },
      filterNewComment() {
        return this.newComment.replace(/^\n+/g, '').replace(/(\n{2,})+/g, '\n\n').replace(/\n+$/g, '').replace(/( {30,})+/g, ' ').replace(/ +$/g, '')
      },
      filterNewCommentLineCount() {
        return this.filterNewComment.split('\n').length
      }
    },
    watch: {
      loading() {
      },
      initialMessageLimit() {
        this.limit = parseInt(this.initialMessageLimit)
      }
    },
    components: {
      appWrapper: Wrapper,
      signWrapper: Sign
    },
    created() {
      this.checkAutoLogin();
      axios.get(this.baseURL + 'api/user/comments?bearerToken=' + this.apiKey)
        .then(res => {
          const data = res.data.data;
          for (let key in data) {
            let comment = data[key]
            comment.id = comment.id
            comment.depth = 'commentsGrid/' + this.nodeName + '/comments/' + comment.id
            this.comments.unshift(comment)
          }
          this.loading = false;
          this.$emit('loading-finished');
        })
        .catch(err => console.log(err))
    }
  }
</script>

<style scoped>
  @import url("https://fonts.googleapis.com/css?family=Roboto:400,700");

  .loader {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(150px, auto);
    padding: 5px;
  }
  #loader {
    justify-self: center;
    align-self: center;
  }
  .comments>>>.alert {
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    border-radius: 4px;
    border-width: 3px 0 3px;
    border-style: solid;
    color: #fff;
    font-size: 13px;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    white-space: pre-line;
    text-align: center;
  }
  .comments>>>.alert.alert {
    border-color: rgba(0, 0, 0, 0.12) !important;
  }
  .comments>>>.success {
    background-color: #4caf50 !important;
  }
  .comments>>>.pass {
    border-color: #4caf50 !important;
  }
  .comments>>>.info {
    background-color: #2196f3 !important;
  }
  .comments>>>.default {
    border-color: #2196f3 !important;
  }
  .comments>>>.alert.fail {
    background-color: #ff5252 !important;
  }
  .comments>>>.fail {
    border-color: #ff5252 !important;
  }
  .comments>>>::-webkit-input-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments>>>::-moz-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments>>>:-ms-input-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments>>>:-moz-placeholder {
    color: #92b1b3 !important;
    text-align: center;
  }
  .comments {
    font-family: "Roboto", sans-serif;
    overflow: hidden;
    border-radius: 4px;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .comments>>>.comments {
    overflow-x: auto;
  }
  .comments > .innerWrapper {
    overflow-x: auto;
    padding: 10px 2px;
  }
  .comments>>>.noCommentWrapper {
    display: grid;
    padding-top: 15px;
  }
  .comments>>>.noCommentText {
    color: rgba(42, 94, 190, 1);
    cursor: pointer;
    text-align: center;
    border: 1px solid rgba(42, 94, 190, 1);
    padding: 8px 10px;
    font-weight: 700;
    border-radius: 18px;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0px;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.noCommentText:hover {
    color: #fff;
    background-color: rgba(42, 94, 190, 1);
  }
  .comments>>>.userName {
    display: grid;
    grid-template-columns: 1fr 0.001fr;
    font-size: 14px;
    line-height: 14px;
    margin-top: 2px;
    font-weight: 700;
    color: rgb(6, 177, 183);
    word-break: break-word;
  }
  .comments>>>.userName > .logOut {
    white-space: nowrap;
    color: #92b1b3;
    cursor: pointer;
    margin-right: 10px;
    transition: color linear 0.1s;
    -moz-transition: color linear 0.1s;
    -webkit-transition: color linear 0.1s;
  }
  .comments>>>.userName > .logOut:hover {
    color: rgb(6, 177, 183);
  }
  .comments>>>.dot {
    color: #c2c6cc;
    font-size: 13px;
    white-space: nowrap;
  }
  .comments>>>.avatar {
    border-top-right-radius: 22px;
  }
  .comments>>>.avatar > svg {
    border-radius: 50%;
    height: 44px;
    width: 44px;
    transition: 0.3s;
    -moz-transition: 0.3s;
    -webkit-transition: 0.3s;
  }
  .comments>>>.addComment {
    display: grid;
    grid-template-columns: 0.001fr 1fr;
    grid-auto-rows: minmax(0, auto);
    grid-column-gap: 10px;
    padding-top: 2px;
  }
  .comments>>>.commentBox {
    display: grid;
    grid-template-columns: minmax(300px, auto) 0.2fr;
    grid-auto-rows: minmax(0, -webkit-max-content);
    grid-auto-rows: minmax(0, max-content);
    grid-auto-rows: minmax(0, -moz-max-content);
    grid-row-gap: 4px;
    overflow: auto;
    max-width: 800px;
  }
  .comments>>>.commentBox > textarea,.comments>>>.commentBox > input {
    font-family: "Roboto", sans-serif;
    color: #2a2e2e;
    justify-self: stretch;
    box-sizing: border-box;
    height: 32px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 22px;
    font-size: 13px;
    line-height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(204, 212, 216, 0.8);
    overflow: hidden;
    resize: none;
    outline: none;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.commentBox > button {
    font-family: "Roboto", sans-serif;
    background-color: rgba(42, 94, 190, 1);
    align-self: end;
    color: #fff;
    max-height: 32px;
    box-sizing: border-box;
    height: 32px;
    padding: 8px 10px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    border-radius: 18px;
    border: none;
    cursor: pointer;
    outline: none;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
    z-index: 100;
  }
  .comments>>>.commentBox > button:hover {
    background-color: rgba(37, 75, 145, 1);
  }
  .comments>>>.remainingLetter {
    justify-self: end;
    align-self: start;
    box-sizing: border-box;
    height: 32px;
    display: grid;
    border-radius: 18px;
    padding-left: 3px;
    padding-right: 4px;
    margin-top: -42px;
    z-index: 99;
  }
  .comments>>>.remainingLetter > span {
    align-self: center;
    font-size: 11px;
    line-height: 11px;
    padding: 3px;
    color: #aaa;
  }
  .comments>>>.updateLimit {
    display: grid;
    grid-template-columns: 1fr;
  }
  .comments>>>.limit {
    color: rgb(6, 177, 183);
    font-weight: 700;
    justify-self: center;
    font-size: 14px;
    line-height: 14px;
    box-sizing: border-box;
    border-radius: 18px;
    padding: 8px 10px;
    cursor: pointer;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.limit:hover {
    color: #fff;
    background-color: #2196f3;
  }
  .comments>>>.fade-enter {
    opacity: 0;
  }
  .comments>>>.fade-enter-active {
    transition: opacity 0.3s;
    -moz-transition: opacity 0.3s;
    -webkit-transition: opacity 0.3s;
  }
  .comments>>>.fade-leave-active {
    transition: opacity 0.3s;
    -moz-transition: opacity 0.3s;
    -webkit-transition: opacity 0.3s;
    opacity: 0;
  }
  @media only screen and (max-width: 480px) {
    .comments>>>.avatar > svg {
      height: 20px;
      width: 20px;
    }
    .comments>>>.nameWrapper > .time {
      overflow: hidden;
      width: 38px;
      text-overflow: ellipsis;
    }
  }
  @media (hover: none) {
    .comments>>>::-webkit-scrollbar {
      -webkit-appearance: none !important;
    }
    .comments>>>::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
      background-color: rgba(204, 212, 216, 0.2) !important;
    }
    .comments>>>::-webkit-scrollbar-thumb {
      background: rgba(204, 212, 216, 0.7) !important;
    }
    .comments>>>.commentBox {
      overflow: unset;
    }
  }
  .comments>>>.requestLoading {
    display: inline-block;
    border: 4px solid transparent;
    border-left-color: #fff;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    animation: requestLoading-spin 0.5s linear infinite;
  }
  @keyframes requestLoading-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
