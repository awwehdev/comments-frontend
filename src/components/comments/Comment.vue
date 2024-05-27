<template>
  <div class="comments">
    <div class="wrapper" @mouseenter="showHideBar = true; $emit('close-hide-bar',false);" @mouseleave="showHideBar = false; $emit('close-hide-bar',true);" >
      <div class="avatar" :style="styleShadow">
        <svg ref="svgAvatar"> </svg>
      </div>
      <div class="commentWrapper" v-if="hideMessage">
        <div class="nameWrapper">
          <div class="name" :style="{color: userNameColor}">{{name}} ({{email}})</div>
          <span class="dot">•</span>
          <a class="time" :title="getTime">{{getTimeDiff}}</a>
          <div v-show="showHideBar || wrapperSize < 1024" @click="hideMessage=false" class="expand">
            <span title="Show Comment">+</span>
          </div>
          <span v-show="!showHideBar && ! wrapperSize < 1024" style="width:22px;"></span>
        </div>
        <div class="hiddenMessage"><i>[ Message is hidden. ]</i></div>
      </div>
      <div class="commentWrapper" v-show="!hideMessage">
        <div class="nameWrapper" v-show="!beforeUpdate">
          <div class="name" :style="{color: userNameColor}">{{name}} ({{email}}) {{homepage}}</div>
          <span class="dot">•</span>
          <span class="time" :title="getTime">{{getTimeDiff}}</span>
          <div v-show="showHideBar || wrapperSize < 1024" @click="hideMessage=true" class="expand">
            <span title="Hide Comment">−</span>
          </div>
          <span v-show="!showHideBar && !wrapperSize < 1024" style="width:22px;"></span>
        </div>
        <div class="comment" v-show="!beforeUpdate" ref="comment" :style="{background: commentBackgroundColor, color: commentTextColor}">{{filteredComment}}</div>
        <div class="commentBox" key="commentBox" v-show="beforeUpdate">
          <div class="userName" :style="{color: userNameColor}">{{name}}</div>
          <textarea
            name="addUpdate"
            class="addComment" 
            ref="addUpdate" 
            placeholder="Update message"
            @keyup="resize($event,true)"
            v-model="updateMessage"
            :style="{background:commentBackgroundColor, color: commentTextColor, height: updateHeight+'px'}"
            spellcheck="false"
            aria-label="Add Comment"
          ></textarea>
          <button aria-label="Update" v-if="requestLoading"><div class="requestLoading"></div></button>
          <button @click="update" aria-label="Update" v-else>Update</button>
          <div class="remainingLetter" :style="{ background: remainingUpdateLetter<0 ? 'rgba(255, 82, 82,1)' :'rgba(42, 94, 190, 1)'}">
            <span>{{remainingUpdateLetter}}</span>
          </div>
          <transition name="fade">
            <div class="alert" v-if="alert" :class="alertClass" :key="alertClass" style="align-self:start; margin-top: -5px; margin-bottom: 7px;">
              <div>{{alertMessage}}</div>
            </div>
          </transition>
        </div>
        <div class="reply" v-show="beforeUpdate">
          <div @click="beforeUpdate = false" style="margin-top:-8px;">Newer mind</div>
        </div>
        <div class="reply" v-show="!beforeUpdate">
          <div @click="handleBeforeReply()">{{ beforeReply ? 'Newer mind' : 'Reply'}}</div>
          <span v-if="replys.length!=0" class="dot">•</span>
          <div v-if="replys.length!=0" @click="showReply">{{ showReplies ? 'Hide replies' : 'Show replies ['+replys.length+']'}}</div>
          <!-- <span v-if="userId==nodeUserId || isAdmin" class="dot">•</span> -->
          <!-- <div v-if="userId==nodeUserId || isAdmin" @click=" handleBeforeUpdate();">Update</div> -->
          <!-- <span v-if="userId==nodeUserId || isAdmin" class="dot">•</span> -->
          <!-- <div class="delete" v-if="userId==nodeUserId || isAdmin">
            <div @click="handleBeforeDelete();" class="deleteText">Delete</div>
            <transition name="popUp">
              <div class="deletePrompt" v-if="beforeDelete">
                <label>Are you sure?</label>
                <button aria-label="Update" v-if="requestDelete"><div class="requestLoading"></div></button>
                <button aria-label="Yes" class="yesPrompt" @click="deleteComment();" v-else>Yes</button>
                <button aria-label="No" class="noPrompt" v-if="requestDelete">No</button>
                <button aria-label="No" class="noPrompt" @click="beforeDelete=false" v-else>No</button>
              </div>
            </transition>
          </div> -->
        </div>
        <div v-show="beforeReply">
          <div class="addComment" key="addComment">
            <div class="avatar" :style="styleShadow">
              <svg ref="svgReplyAvatar"> </svg>
            </div>
            <div class="commentBox" key="commentBox" v-show="!showSignPanel && !auth || auth ">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                aria-label="Your name"
                class="addComment" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                v-model="replyUserName"
              >
              <br />
              <input
                type="email"
                name="email"
                placeholder="Your E-Mail"
                aria-label="Your E-Mail" 
                class="addComment" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                v-model="replyEmail"
              >
              <br />
              <input
                type="text"
                name="homepage"
                placeholder="Homepage"
                aria-label="Homepage"
                class="addComment" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                v-model="replyHomepage"
              >
              <br />
              <textarea 
                name="addReply" 
                class="addComment" 
                ref="addReply" 
                placeholder="Add new reply" 
                v-model="replyMessage"
                @keyup="resize($event)" 
                :style="{background:commentBackgroundColor, color: commentTextColor}"
                spellcheck="false"
                aria-label="Add Reply"
                rows="3"
              ></textarea>
              <br />
              <div class="remainingLetter" :style="{ color: remainingLetter<0 ? 'rgba(255, 82, 82,1)' :'rgba(42, 94, 190, 1)'}"><span>{{remainingLetter}}</span></div>        
              <br />
              <button aria-label="Reply" v-if="requestLoading"><div class="requestLoading"></div></button>
              <button @click="reply" aria-label="Reply" v-else>Reply</button>
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
        </div>
        <transition-group 
          appear
          name="fade"
          mode="out-in">
          <app-wrapper 
            v-show="showReplies"
            v-for="(reply,index) in replys"
            v-if="index < limit"
            :baseURL="baseURL"
            :apiKey="apiKey"
            :show="showProp"
            :deleted="deletedProp"
            :maxUserNameLength="maxUserNameLength"
            :maxCommentLength="maxCommentLength"
            :maxShowingDepth="maxShowingDepth"
            :maxLineLimit="maxLineLimit"
            :id="reply.id"
            :timestamp="reply.created_at"
            :lineCount="reply.children.length"
            :nodeUserId="reply.user_id"
            :nodeName="nodeName" 
            :name="reply.name" 
            :email="reply.email" 
            :homepage="reply.homepage" 
            :comment="reply.text" 
            :replies="reply.children"
            :depth="reply.depth"
            :key="reply.id"
            v-on:delete-row="deleteFromParent(index)"
            v-on:sign-user="signUser"
            v-on:close-hide-bar="closeHideBar"
            :auth="auth"
            :userId="userId"
            :apikey="apikey"
            :isAdmin="isAdmin"
            :userName="userName"
            :commentBackgroundColor="commentBackgroundColor"
            :commentTextColor="commentTextColor"
            :userNameColor="userNameColor"
            :depthLength="depthLength+1"
            :wrapperSize="wrapperSize"
            :custom="custom"
          ></app-wrapper>
        </transition-group>
        <div class="updateLimit" @click="updateLimit" v-if="limit < replys.length && showReplies">
          <span class="limit">Show more reply</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  'use strict';
  import axios from 'axios';
  import Sign from './Sign.vue'

  export default {
    name: 'app-wrapper',
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
      maxCommentLength: {
        type: String,
        default: '1000'
      },
      maxUserNameLength: {
        type: String,
        default: '30'
      },
      name: String,
      comment: String,
      replies: {
        type: Array,
      },
      auth: Boolean,
      id: String,
      timestamp: String,
      lineCount: Number,
      depth: String,
      depthLength: Number,
      apikey: String,
      userId: String,
      isAdmin: {
        type: Boolean,
        default: false
      },
      userName: String,
      email: String,
      homepage: String,
      nodeUserId: String,
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
      show: {
        type: Boolean,
        default: false
      },
      deleted: {
        type: Boolean,
        default: false
      },
      wrapperSize: String,
      custom: {
        type: String,
        default: 'false'
      }
    },
    data() {
      return {
        showSignPanel: false,
        showReplies: false,
        showProp: this.show,
        showHideBar: false,
        deletedProp: this.deleted,
        replied: false,
        beforeReply: false,
        beforeUpdate: false,
        beforeDelete: false,
        filteredComment: '',
        updateHeight: 0,
        svgAvatarCheck: false,
        date: '',
        replyMessage: '',
        replyUserName: '',
        replyEmail: '',
        replyHomepage: '',
        updateMessage: '',
        replys: [],
        mods: [],
        depthFromReplies: '',
        styleShadow: {
          boxShadow: '1px -1px rgba(' + Math.round(Math.random() * 244) + ',' + Math.round(Math.random() * 244) + ',' + Math.round(Math.random() * 244) + ',0.6)'
        },
        limit: parseInt(this.initialMessageLimit),
        alert: false,
        alertMessage: '',
        alertClass: '',
        hideMessage: false,
        outerWidth: 0,
        requestLoading: false,
        requestDelete: false,
        timeOutHolder: null
      }
    },
    methods: {
      signUser(data) {
        this.$emit('sign-user', data)
      },
      closeHideBar(bool) {
        this.showHideBar = bool;
      },
      updateLimit() {
        this.limit += parseInt(this.initialMessageLimit)
      },
      resize(event, from) {
        event.target.style.height = "auto"
        event.target.style.height = event.target.scrollHeight + "px"
        if (from) {
          if (this.updateMessage == '' && this.$refs.addUpdate.style.height != 32) {
            this.$refs.addUpdate.style.height = 32 + 'px'
          }
        } else {
          if (this.replyMessage == '' && this.$refs.addReply.style.height != 32) {
            this.$refs.addReply.style.height = 32 + 'px'
          }
        }
      },
      handleBeforeReply() {
        this.clearAlert()
        this.beforeReply = !this.beforeReply
        this.$nextTick(() => {
          this.$refs.addReply.focus();
        })
      },
      reply() {
        if (this.custom != 'false') {
          this.setAlert('This for customization, if you want to comment please look at the Fullscreen demo.\n', 'fail')
          return
        }
        // if (this.auth) {
          if (this.filterNewComment.length != 0) {
            this.requestLoading = true;
            let replyObj = { name: this.filterUserName, email: this.filterEmail, text: this.filterNewComment, homepage: this.filterHomepage, topic: this.nodeName, children: [], reply_id: this.id}
            axios.post(this.baseURL + 'api/user/comments' + '?bearerToken=' + this.apiKey, replyObj)
              .then(res => {
                replyObj.id = res.data.data.id;
                replyObj.created_at = res.data.data.created_at;
                this.replys.splice(0, 0, replyObj)
                this.replyMessage = ''
                this.$refs.addReply.style.height = 32 + 'px'
                this.beforeReply = !this.beforeReply
                if (!this.replied) {
                  this.replied = true
                  if (!this.showReplies) {
                    this.showReplies = !this.showReplies
                  }
                }
                this.clearAlert();
              })
              .catch(err => this.setAlert(err.response.data.hasOwnProperty('message') ? err.response.data.message : 'Invalid comment', 'fail'))
          } else {
            this.setAlert('You can\'t send empty comment!\n', 'fail')
          }
        // } else {
        //   this.showSignPanel = false
        // }
      },
      handleBeforeUpdate() {
        this.beforeReply = false;
        this.beforeUpdate = true;
        this.updateMessage = this.filteredComment;
        this.$refs.addUpdate.style.height = this.updateHeight + 'px'
        this.$nextTick(() => {
          this.$refs.addUpdate.focus();
        })
      },
      update() {
        if (this.custom != 'false') {
          this.setAlert('This for customization, if you want to comment please look at the Fullscreen demo.\n', 'fail')
          return
        }
        if (this.auth) {
          this.requestLoading = true;
          if (!this.isAdmin) {
            if(this.filterNewUpdate.length!=0) {
              let replyObj = { name: this.filterUserName, email: this.filterEmail, text: this.filterNewUpdate }
              axios.patch(this.baseURL + '/' + this.depth + '.json' + '?apikey=' + this.apikey, replyObj)
                .then(res => {
                  this.clearAlert()
                  this.filteredComment = this.filterNewUpdate
                  this.afterUpdate()
                  setTimeout(() => {
                    this.updateMessage = ''
                  }, 3);
                  this.beforeUpdate = false;
                })
                .catch(err => {
                  this.setAlert('Invalid comment or comment deleted!\n', 'fail')
                  setTimeout(() => {
                    this.$emit('delete-row');
                  }, 5000);
                })
              } else {
                this.setAlert('You can\'t send empty comment!\n', 'fail')
              }
          } else {
            if(this.filterNewUpdate.length!=0) {
              let replyObj = { comment: this.filterNewUpdate, lineCount: this.filterNewUpdateLineCount }
              axios.patch(this.baseURL + '/' + this.depth + '.json' + '?apikey=' + this.apikey, replyObj)
                .then(res => {
                  this.clearAlert()
                  this.filteredComment = this.filterNewUpdate
                  this.afterUpdate()
                  setTimeout(() => {
                    this.updateMessage = ''
                  }, 3);
                  this.beforeUpdate = false;
                })
              .catch(err => this.setAlert(err.response.data.message ? err.response.data.message : 'Invalid comment', 'fail'))
            } else {
              this.setAlert('You can\'t send empty comment!\n', 'fail')
            }
          }
        } else {
          this.showSignPanel = false
        }
      },
      showReply() {
        this.replied = false
        this.showReplies = !this.showReplies
        this.showProp = !this.showProp
      },
      handleBeforeDelete() {
        clearTimeout(this.timeOutHolder);
        this.beforeDelete = !this.beforeDelete;
        this.timeOutHolder = setTimeout(() => {
          this.beforeDelete = false;
        }, 5000);
      },
      deleteComment() {
        if (this.custom != 'false') {
          this.setAlert('This for customization, if you want to comment please look at the Fullscreen demo.\n', 'fail')
          return
        }
        this.requestDelete = true;
        this.deletedProp = true;
        const splt = this.depth.split('/')
        const changeDept1 = splt[0] + '/' + splt[1] + '/' + splt[2] + '/' + splt[splt.length - 1]
        const changedDepth2 = this.depth.replace('/comments/', '/replys/')
        axios.delete(this.baseURL + '/' + changedDepth2 + '.json' + '?bearerToken=' + this.apiKey)
          .then(res => {
            this.replys = []
            this.$emit('delete-row');
          })
          .catch(err => console.log(err))
      },
      deleteFromParent(index) {
        this.replys.splice(index, 1)
      },
      setAlert(message, style, type) {
        type == 'append' ? this.alertMessage += message : this.alertMessage = message
        this.alertClass = style
        this.alert = true
        this.requestLoading = false;
        setTimeout(() => {
          this.clearAlert();
        }, 5000);
      },
      clearAlert() {
        this.requestLoading = false;
        this.alertMessage = ''
        this.alertClass = ''
        this.alert = false
      },
      afterUpdate() {
        if (this.filterNewUpdateLineCount > +(this.maxLineLimit)) {
          this.filteredComment = ''
          let splt = this.updateMessage.split("\n");
          for (let i = 0; i < splt.length; i++) {
            if (i < +this.maxLineLimit) {
              this.filteredComment += splt[i] + "\n";
            } else {
              this.filteredComment += splt[i] + " ";
            }
          }
        }
      }
    },
    computed: {
      viewWidth() {
        return this.outerWidth
      },
      remainingLetter() {
        if (this.maxCommentLength <= this.replyMessage.length) {
          return 0;
        }

        return +(this.maxCommentLength) - this.replyMessage.length
      },
      remainingUpdateLetter() {
        return +(this.maxCommentLength) - this.updateMessage.length
      },
      getTimeDiff() {
        const date1 = new Date(+(this.timestamp));
        const date2 = new Date(Date.now());
        const yearDiff = Math.abs(date2.getFullYear() - date1.getFullYear());
        const monthDiff = Math.abs(date2.getMonth() - date1.getMonth());
        const dayDiff = Math.abs(date2.getDate() - date1.getDate());
        const hourDiff = Math.abs(date2.getHours() - date1.getHours());
        const minuteDiff = Math.abs(date2.getMinutes() - date1.getMinutes());

        return (yearDiff != 0 && yearDiff == 1) ? 'a year ago' : (yearDiff > 1) ? yearDiff + ' years ago' : (monthDiff != 0 && monthDiff == 1) ? 'a month ago' : (monthDiff > 1) ? monthDiff + ' months ago' : (dayDiff != 0 && dayDiff == 1) ? 'a day ago' : (dayDiff > 1) ? dayDiff + ' days ago' : (hourDiff != 0 && hourDiff == 1) ? 'a hour ago' : (hourDiff > 1) ? hourDiff + ' hours ago' : (minuteDiff != 0 && minuteDiff == 1) ? 'a minute ago' : (minuteDiff > 1) ? minuteDiff + ' minutes ago' : 'seconds ago';
      },
      getTime() {
        const date = new Date(+(this.timestamp))
        const options = {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
        }
        return new Intl.DateTimeFormat('en-Us', options).format(date)
      },
      filterUserName() {
        return this.replyUserName.replace(/^ +/g, '').replace(/ +/g, ' ').replace(/ +$/g, '')
      },
      filterEmail() {
        return this.replyEmail;
      },
      filterHomepage() {
        return this.replyHomepage.replace(/^ +/g, '').replace(/ +/g, ' ').replace(/ +$/g, '')
      },
      filterNewComment() {
        return this.replyMessage.replace(/^ +/g, '').replace(/^\n+/g, '').replace(/(\n{2,})+/g, '\n\n').replace(/\n+$/g, '').replace(/( {30,})+/g, ' ').replace(/ +$/g, '')
      },
      filterNewCommentLineCount() {
        return this.filterNewComment.split('\n').length
      },
      filterNewUpdate() {
        return this.updateMessage.replace(/^ +/g, '').replace(/^\n+/g, '').replace(/(\n{2,})+/g, '\n\n').replace(/\n+$/g, '').replace(/( {30,})+/g, ' ').replace(/ +$/g, '')
      },
      filterNewUpdateLineCount() {
        return this.updateMessage.split('\n').length
      }
    },
    watch: {
      show() {
        let updateHeight = this.$refs.comment.clientHeight
        if (updateHeight != 0) {
          this.updateHeight = updateHeight + 14
        }
      },
      deleted() {
        this.deletedProp = true;
        const splt = this.depth.split('/')
        const changeDept1 = splt[0] + '/' + splt[1] + '/' + splt[2] + '/' + splt[splt.length - 1]
        axios.get(this.baseURL + '/' + changeDept1 + '.json')
          .then(res => {
            const data = res.data;
            for (let key in data) {
              if (key.startsWith("-")) {
                axios.delete(this.baseURL + '/commentsGrid/' + this.nodeName + '/replys/' + key + '.json' + '?apikey=' + this.apikey)
                  .then(res => {
                    this.$emit('delete-row');
                    this.replys = []
                  })
                  .catch(err => console.log(err))
              }
            }
          })
          .catch(err => console.log(err))
      },
      maxShowingDepth() {
        if (this.depthLength < +(this.maxShowingDepth)) {
          this.showReplies = true
        } else {
          this.showReplies = false
        }
      },
      maxLineLimit() {
        if (this.lineCount > +(this.maxLineLimit) || this.lineCount != this.comment.split('\n').length) {
          this.filteredComment = ''
          let splt = this.comment.split('\n');
          for (let i = 0; i < splt.length; i++) {
            if (i < +(this.maxLineLimit)) {
              this.filteredComment += splt[i] + '\n'
            } else {
              this.filteredComment += splt[i] + ' '
            }
          }
        } else {
          this.filteredComment = this.comment
        }
      }
    },
    components: {
      signWrapper: Sign
    },
    created() {
      this.depthFromReplies = this.depth + '/' + this.id + '/reply'
      if (this.depthLength < +(this.maxShowingDepth)) {
        this.showReplies = true
      }
      this.replys = this.replies;
      if (this.lineCount > +(this.maxLineLimit) || this.lineCount != this.comment.split('\n').length) {
        let splt = this.comment.split('\n');
        for (let i = 0; i < splt.length; i++) {
          if (i < +(this.maxLineLimit)) {
            this.filteredComment += splt[i] + '\n'
          } else {
            this.filteredComment += splt[i] + ' '
          }
        }
      } else {
        this.filteredComment = this.comment
      }
    },
    mounted() {
      this.$nextTick(() => {
      })
    }
  }
</script>

<style scoped>
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
  .comments>>>.wrapper {
    display: grid;
    grid-template-columns: 0.001fr 1fr;
    grid-auto-rows: minmax(0, auto);
    padding-top: 15px;
  }
  .comments>>>.commentWrapper {
    display: grid;
    grid-auto-rows: minmax(0, auto);
    grid-auto-columns: minmax(-webkit-min-content, -webkit-max-content);
    grid-auto-columns: minmax(min-content, max-content);
    grid-auto-columns: minmax(-moz-min-content, -moz-max-content);
    grid-gap: 10px;
  }
  .comments>>>.hiddenMessage {
    color: #ffc107;
    word-break: break-word;
    font-size: 13px;
    margin-left: 20px
  }
  .comments>>>.nameWrapper {
    display: grid;
    grid-template-columns: repeat(4, 0.001fr);
    grid-auto-columns: minmax(0, auto);
    grid-column-gap: 5px;
    line-height: 13px;
    white-space: nowrap;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-left: 20px;
  }
  .comments>>>.nameWrapper > .name {
    color: rgb(6, 177, 183);
    font-size: 14px;
    line-height: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .comments>>>.nameWrapper > .time {
    cursor: help;
    font-size: 13px;
    color: #92b1b3;
    white-space: nowrap;
    text-decoration: none;
  }
  .comments>>>.nameWrapper > .expand {
    cursor: pointer;
    display: grid;
    width: 22px;
    height: 13px;
    border-radius: 3px;
    color: #ccd4d8;
    box-shadow: inset 0 0 0 2px rgba(204, 212, 216, 1);
    transition: color linear 0.1s;
    -moz-transition: color linear 0.1s;
    -webkit-transition: color linear 0.1s;
  }
  .comments>>>.nameWrapper > .expand:hover {
    color: #2196f3;
  }
  .comments>>>.nameWrapper > .expand > span {
    align-self: center;
    justify-self: center;
    font-size: 20px;
  }
  .comments>>>.comment {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
    background: #fff;
    color: #1d2129;
    font-size: 13px;
    line-height: 16px;
    font-kerning: normal;
    padding: 8px 10px;
    border-radius: 4px;
    border: 1px solid rgba(204, 212, 216, 0.8);
    min-width: -webkit-min-content;
    min-width: min-content;
    min-width: -moz-min-content;
    max-width: -webkit-max-content;
    max-width: max-content;
    max-width: -moz-max-content;
    margin-left: 20px;
  }
  .comments>>>.reply {
    display: grid;
    grid-template-columns: repeat(7, 0.001fr);
    grid-auto-columns: minmax(0, auto);
    grid-auto-rows: minmax(0, auto);
    grid-column-gap: 5px;
    font-size: 13px;
    white-space: nowrap;
    color: #92b1b3;
    margin-top: -8px;
    margin-left: 10px;
    transition: color linear 0.1s;
    -moz-transition: color linear 0.1s;
    -webkit-transition: color linear 0.1s;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-left: 20px;
  }
  .comments>>>.reply > div {
    cursor: pointer;
  }
  .comments>>>.reply > div:hover {
    color: #2196f3;
  }
  .comments>>>.reply > .delete {
    display: grid;
    box-sizing: border-box;
    height: -webkit-min-content;
    height: -moz-min-content;
    height: min-content;
  }
  .comments>>>.reply > .delete:hover {
    color: #ff5252;
  }
  .comments>>>.reply > .delete > .deleteText:hover {
    color: #ff5252;
  }
  .comments>>>.reply > .delete > .deletePrompt {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: minmax(0, auto);
    grid-gap: 3px;
    color: #ff5252;
    box-sizing: border-box;
    background-color: #fff;
    padding: 3px 13px;
    border-radius: 4px;
    height: -webkit-max-content;
    height: -moz-max-content;
    height: max-content;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    border: 1px solid rgba(204, 212, 216, 0.8);
    margin-top: -60px;
    margin-left: -24px;
    z-index: 999;
  }
  .comments>>>.reply > .delete > .deletePrompt > label {
    grid-column: 1/3;
    grid-row: 2;
    font-weight: 700;
    margin-left: -7px;
  }
  .comments>>>.reply > .delete > .deletePrompt > button {
    grid-row: 1;
    font-size: 11px;
    font-family: "Roboto", sans-serif;
    background-color: rgba(42, 94, 190, 1);
    color: #fff;
    font-size: 12px;
    line-height: 15px;
    border-radius: 18px;
    border: none;
    cursor: pointer;
    outline: none;
    transition: linear 0.1s all;
    -moz-transition: linear 0.1s all;
    -webkit-transition: linear 0.1s all;
  }
  .comments>>>.reply > .delete > .deletePrompt > .yesPrompt {
    border: 1px solid rgba(42, 94, 190, 0.9);
    background-color: rgba(42, 94, 190, 0.9);
    color: fff;
  }
  .comments>>>.reply > .delete > .deletePrompt > .yesPrompt:hover {
    border: 1px solid #ff5252;
    background-color: #ff5252;
    color: #fff;
  }
  .comments>>>.reply > .delete > .deletePrompt > .noPrompt {
    border: 1px solid rgba(42, 94, 190, 0.9);
    background-color: #fff;
    color: rgba(42, 94, 190, 0.9);
  }
  .comments>>>.reply > .delete > .deletePrompt > .noPrompt:hover {
    border: 1px solid rgba(42, 94, 190, 0.9);
    background-color: rgba(42, 94, 190, 0.9);
    color: #fff;
  }
  .comments>>>.popUp-enter-active {
    animation: pop-up 0.2s ease-out forwards;
  }
  .comments>>>.popUp-leave-active {
    animation: pop-out 0.2s ease-out forwards;
  }
  @keyframes pop-up {
    from {
      margin-top: -45px;
      opacity: 0;
    }
    to {
      margin-top: -60px;
      opacity: 1;
    }
  }
  @keyframes pop-out {
    from {
      margin-top: -60px;
      opacity: 1;
    }
    to {
      opacity: 0;
      margin-top: -45px;
    }
  }
</style>
